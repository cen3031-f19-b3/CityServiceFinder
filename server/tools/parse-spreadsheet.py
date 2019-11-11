#!/usr/bin/env python3
''' To install dependencies:
    sudo pip3 install -r ./pyreqs
'''

print('Database upload script loading...')

import argparse
import json
import pandas
import pymongo
import os

from math import isnan
from urllib.parse import quote_plus

def load_parser():
	parser = argparse.ArgumentParser(
		description='Parse an excel datafile into the database.'
	)

	parser.add_argument(
		'file',
		default=None,
		nargs='?',
		help='File to be parsed into the database.'
	)

	parser.add_argument(
		'--batch', '-b',
		action='store_true',
		help='Enable Batch Mode, discarding any rows with incomplete or erroneous data. This will disable all user interaction, so all options must be passed via arguments. If you do not want to specify the password on the command line with --mongodb-password, you can omit it and instead set the environment variable MONGODB_PASSWORD or use the --config-file option.'
	)

	parser.add_argument(
		'--config-file', '-c',
		help='Path to a JSON file containing configuration information. Command-line options will override information loaded from this file.'
	)

	parser.add_argument(
		'--mongodb-user', '-u',
		help='Username for the mongodb instance to connect to.'
	)

	parser.add_argument(
		'--mongodb-password', '-p',
		help='Password for the mongodb instance to connect to. Will prompt for password if not provided, or check the environment variable MONGODB_PASSWORD if -b is also specified.'
	)

	parser.add_argument(
		'--mongodb-host', '-H',
		help='Hostname for the mongodb instance to connect to. DO NOT use the full URL here - specify protocol and auth database separately with --mongodb-proto and --mongodb-auth-db'
	)

	parser.add_argument(
		'--mongodb-proto', '-P',
		default='mongodb',
		help='Protocol to connect to the mongodb instance. Must be mongodb or mongodb+srv.'
	)

	parser.add_argument(
		'--mongodb-auth-db', '-d',
		help='Database against which the mongodb user should authenticate. Unless overridden with --mongodb-db, this will also be the database into which objects are inserted.'
	)

	parser.add_argument(
		'--mongodb-db', '-D',
		help='Database to insert objects into. Defaults to the same database as --mongodb-auth-db.'
	)

	return parser


def nb(cell):
	''' Returns true iff a cell exists and is Not Blank 
			Note that cells containing the string "n/a", regardless of
			capitalization, are considered blank.
	'''
	if not cell:
		return False
	if type(cell) == float:
		return not isnan(cell)
	elif type(cell) == str:
		return not cell.lower() == "n/a"
	else:
		return True


def recover(missing_field, identifier, batch):
	''' If not running in batch mode, prompt the user to fill in missing required
	    information.
	'''
	print(f'  WARN: Missing required field {missing_field} for {identifier}.')
	recovered = None
	if batch:
		print('    > Running in batch-mode. Cannot recover this information.')
	else:
		print('    > Please correct this issue manually (or leave blank to abort recovery).')
		recovered = input(f'    [ {missing_field} ] > ')
	
	if recovered:
		print(f'    > {missing_field} will be set to {recovered}.')
		return recovered
	else:
		print(f'    ERR: Unable to recover requried field {missing_field} for {identifier}.')
		return None


def check_yn(to_check):
	''' This function does its very best to determine whether a given string
	    can be interpreted as "yes" or "no". Please be patient with it, and try
			to understand how difficult its job is. Returns a number between -3 and
			3, to indicate how likely it is to be yes or no. Negative numbers
			indicate that the answer is more likely to be no; positive numbers
			indicate that it is likely to be yes. Numbers further from zero indicate
			greater certainty. Accepting any result greater than 1 or less than -1
			should be acceptable for most applications; accepting 1 or -1 should only
			be done if the result absolutely must be interpreted as yes or no - keep
			in mind that the string "maybe" would return 1 (since it contains the
			letter y but not the letters n or f)
	'''
	to_check = to_check.lower().strip()

	# Input is exactly y/n/yes/no/t/f/true/false
	# Very likely to be 'yes' or 'no'
	if to_check == 'y' or to_check == 'yes':
		return 3
	if to_check == 'n' or to_check == 'no':
		return -3
	
	if to_check == 't' or to_check == 'true':
		return 3
	if to_check == 'f' or to_check == 'false':
		return -3

	# Input is exactly 'required' or 'not required'
	# Likely to be 'yes' or 'no'
	if to_check == 'required':
		return 2
	if to_check == 'not required':
		return -2

	# Input contains the entire string yes/no/true/false, but is not *just* this
	# string
	# Likely to be 'yes' or 'no'
	if 'yes' in to_check or 'true' in to_check:
		return 2
	if 'no' in to_check or 'false' in to_check:
		return -2

	# Input contains either one of the characters (y/t) or (n/f), but only
	# contains characters from *one* set, not *both*
	# May be 'yes' or 'no'
	if ('y' in to_check or 't' in to_check) and \
			not ('n' in to_check or 'f' in to_check):
		return 1
	if ('n' in to_check or 'f' in to_check) and \
			not ('y' in to_check or 't' in to_check):
		return -1

	# Cannot make sense of this input
	return 0


def user_check_yn(context, batch, threshold=2):
	''' Asks the user a yes/no question (if we are not in batch mode). Returns 1
	    if the user indicates yes, -1 if the user indicates no, or 0 if the user
			does not give an answer which can be interpreted as either with an
			acceptable degree of certainty (result of check_yn on the user's response
			must be >= threshold or <= -1*threshold)
	'''
	if batch:
		return 0
	
	res = input(f'[ {context} (yes/no) ] > ')
	checked = check_yn(res)

	if checked >= threshold:
		return 1
	elif checked <= threshold:
		return -1
	else:
		return 0


def check_and_recover_yn(to_check, context, batch, threshold=2):
	''' Attempts to parse to_check as yes or no. If check_yn returns yes or no
	    with an acceptable certainty (>= threshold or <= -1*threshold), this
			method returns 1 (yes) or -1 (no). Otherwise, it asks the user to correct
			this information. If the user provides a correction which causes check_yn
			to return a result with acceptable certainty, 1 (yes) or -1 (no) is
			returned. Otherwise, 0 is returned to indicate an unknown result.
	'''
	#print(f'check_and_recover_yn({to_check}, {context}, {batch}, {threshold})')
	chk = check_yn(to_check)
	if chk >= threshold:
		return 1
	if chk <= -1*threshold:
		return -1

	print(f'  WARN: value "{to_check}" (context: {context}) cannot be interpreted as yes or no (check_yn returns {chk}, acceptable certainty threshold {threshold}/-{threshold}).')
	recovered = recover('(must be "yes" or "no")', context, batch)

	if not recovered:
		print(f'  WARN: User did not clarify meaning of field {to_check} (context {context}).')
		return 0

	chk = check_yn(recovered)
	if chk >= threshold:
		return 1
	if chk <= -1*threshold:
		return -1

	print(f'  WARN: User-provided clarification value {recovered} (context {context}) ALSO cannot be interpreted as yes or no (check_yn returns {chk}, accpetable certainty threshold {threshold}/-{threshold}).')
	return 0

def parse_spreadsheet(sheet_file, batch=True):
	''' Attempt to parse as much data from sheet_file as possible. If batch is
	    false, the user may be prompted to manually parse some information to fix
			parts which the script cannot successfully parse.
	'''
	print('===== Parsing spreadsheet =====')
	print(f'Loading workbook {sheet_file}')
	sheet = pandas.read_excel(sheet_file, header=1)
	print('Loaded. Parsing...', end='', flush=True)

	parsed_services = []
	warn_services = 0
	err_services = 0


	for index, row in enumerate(sheet.iterrows()):
		print('.', end='', flush=True)
		service = {}

		# ===== Check name =====
		if nb(row[1]['Provider Name']):
			service['name'] = row[1]['Provider Name']
		else:
			print(f'\nWARN: Service on line {index+3} has no name!')
			name = recover('Name', f'service on line {index+3}', batch)

			if name:
				service['name'] = name
			else:
				print('ERR: Cannot recover service. This service will be discarded.')
				err_services += 1
				continue
				
		problem = False

		# ===== Check address =====
		if nb(row[1]['Address 1']):
			addr_tmp = {
				'line_1': row[1]['Address 1']
			}
			addr_valid = True
			# Used for user interaction (recover(), mainly)
			addr_identifier = f'address {row[1]["Address 1"]} of {row[1]["Provider Name"]} (line {index+3})'

			if nb(row[1]['Address 2']):
				addr_tmp['line_2'] = row[1]['Address 2']

			if nb(row[1]['City']):
				addr_tmp['city'] = row[1]['City']
			else:
				city = recover('City', addr_identifier, batch)

				if city:
					addr_tmp['city'] = city
				else:
					print('    > ERR: Could not correct field. This address will be ignored.')
					addr_valid = False

			if nb(row[1]['State']):
				addr_tmp['state'] = row[1]['State']
			elif not addr_valid:
				print('  WARN: Ignoring missing state due to previous uncorrectable errors.')
			else:
				state = recover('State', addr_identifier, batch)
				
				if state:
					addr_tmp['state'] = state
				else:
					print('    > ERR: Could not correct field. This address will be ignored.')
					addr_valid = False

			if nb(row[1]['Zipcode']):
				addr_tmp['zip'] = row[1]['Zipcode']
			elif not addr_valid:
				print('  WARN: Ignoring missing zipcode due to previous uncorrectable errors.')
			else:
				zipcode = recover('Zip-code', addr_identifier, batch)

				if zipcode:
					addr_tmp['zip'] = zipcode
				else:
					print('    > ERR: Could not correct field. This address will be ignored.')
					addr_valid = False

			if addr_valid:
				service['addresses'] = [addr_tmp]
			else:
				problem = True

		elif nb(row[1]['Address 2']):
			print(f'  WARN: Address line 2 contains "{row[1]["Address 2"]}", but line 1 is empty! Ignoring data in line 2.')
			problem = True

		# ===== Check phone numbers =====
		if nb(row[1]['Phone 1']):
			service['phone_numbers'] = []
			phone1_tmp = {'number': row[1]['Phone 1']}

			if nb(row[1]['Phone 1 Name']):
				phone1_tmp['contact'] = row[1]['Phone 1 Name']
			
			service['phone_numbers'].append(phone1_tmp)

			if nb(row[1]['Phone 2']):
				phone2_tmp = {'number': row[1]['Phone 2']}

				if nb(row[1]['Phone 2 Name']):
					phone2_tmp['contact'] = row[1]['Phone 2 Name']

				service['phone_numbers'].append(phone2_tmp)

			elif nb(row[1]['Phone 2 Name']):
				print(f'  WARN: Phone 2 has name "{row[1]["Phone 2 Name"]}", but phone 1 does not exist! Ignoring Phone 2 information.')
				problem = True

		else:
			if nb(row[1]['Phone 1 Name']):
				print(f'  WARN: Phone 1 has name "{row[1]["Phone 1 Name"]}", but no number! Ignoring Phone 1 information.')
				problem = True

			if nb(row[1]['Phone 2 Name']):
				print(f'  WARN: Phone 2 has name "{row[1]["Phone 2 Name"]}", but phone 1 does not exist! Ignoring Phone 2 information.')
				problem = True

			if nb(row[1]['Phone 2']):
				print(f'  WARN: Phone 2 is "{row[1]["Phone 2"]}", but phone 1 does not exist! Ignoring Phone 2 information.')
				problem = True
				
		# ===== Check freeform service offerings =====
		if nb(row[1]['Services Provided Open Text']):
			service['services_freeform'] = row[1]['Services Provided Open Text']

		# ===== Check categories =====
		tmp_categories = []
		for cid in range(2, 51):
			if nb(row[1].iat[cid]):
				tmp_categories.append(cid-1)

		if tmp_categories:
			service['categories'] = tmp_categories
		else:
			print(f'  WARN: Service on line {index+3} does not have any categories!')
			problem = True

		# ===== Check eligibility criteria =====
		if nb(row[1]['Eligibility Criteria Open Text']):
			service['eligibility_criteria_freeform'] = row[1]['Eligibility Criteria Open Text']

		# ===== Check e-mail addresses =====
		if nb(row[1]['Email Address']):
			if '@' in row[1]['Email Address']:
				service['emails'] = [row[1]['Email Address']]
			else:
				print(f'  WARN: Questionable e-mail address {row[1]["Email Address"]}. Add anyway?')
				res = user_check_yn('add as e-mail address', batch)
				if res == 1:
					service['emails'] = [row[1]['Email Address']]
				elif res == -1:
					print('  WARN: Discarding e-mail address.')
					problem = True
				else:
					print('  WARN: User input cannot be interpreted as "yes" or "no". Discarding e-mail address.')
					problem = True

		# ===== Check bus routes =====
		if nb(row[1]['Bus Routes']):
			service['bus_routes'] = str(row[1]['Bus Routes']).split(',')

		# ===== Check website =====
		if nb(row[1]['Website']):
			service['website'] = [row[1]['Website']]

		# ===== Check if walk-ins are allowed =====
		if nb(row[1]['Walk in ']):
			service['walk_ins'] = row[1]['Walk in ']

		# ===== Check hours =====
		hours = []
		for day in ['Monday', 'Tuesday', 'Wednesday', 'Thursday',
								'Friday', 'Saturday', 'Sunday']:
			if nb(row[1][day]):
				hours.append(f'{day}: {row[1][day]}')

		if hours:
			service['hours'] = hours
		else:
			print(f'  WARN: Service lists no hours.')
			problem = True
		
		# ===== Check appointment status =====
		appointment_info = {}
		if nb(row[1]['Appointment Phone']):
			appointment_info['phone'] = row[1]['Appointment Phone']

		if nb(row[1]['Appointment URL']):
			appointment_info['website'] = row[1]['Appointment URL']

		if nb(row[1]['Appointment Needed']):
			app_need = check_and_recover_yn(
				row[1]['Appointment Needed'],
				f'Appointment Needed on line {index}',
				batch
			)
			if app_need == 1:
				if not appointment_info:
					print('  WARN: Service requires appointments, but provides no appointment URL or phone number.')
					problem = True
				appointment_info['is_required'] = True
			elif app_need == -1:
				appointment_info['is_required'] = False
			else:
				print('  ERR: Could not recover field "Appointment Needed". Ignoring this field.')
				problem = True

		if appointment_info:
			service['appointment'] = appointment_info

		# ===== Check service area =====
		if nb(row[1]['Service Area']):
			service['service_area'] = row[1]['Service Area']

		# ===== Check application info =====
		application = {}
		
		if nb(row[1]['Application Needed']):
			app_need = check_and_recover_yn(
				row[1]['Application Needed'],
				f'Application Needed on line {index}',
				batch
			)
			if app_need == 1:
				application['is_required'] = True
			elif app_need == -1:
				application['is_required'] = False
			else:
				print('  ERR: Could not recover field "Application Needed". Ignoring this field.')
				problem = True

		if nb(row[1]['Application Online']):
			app_need = check_and_recover_yn(
				row[1]['Application Online'],
				f'Application Online on line {index}',
				batch
			)
			if app_need == 1:
				application['apply_online'] = True
			elif app_need == -1:
				application['apply_online'] = False
			else:
				print('  ERR: Could not recover field "Application Online". Ignoring this field.')
				problem = True

		if nb(row[1]['Application In Person']):
			app_need = check_and_recover_yn(
				row[1]['Application In Person'],
				f'Application In Person on line {index}',
				batch
			)
			if app_need == 1:
				application['apply_in_person'] = True
			elif app_need == -1:
				application['apply_in_person'] = False
			else:
				print('  ERR: Could not recover field "Application In Person". Ignoring this field.')
				problem = True

		if application:
			service['application'] = application

		# ===== Check cost information =====
		if nb(row[1]['Cost']):
			service['cost_info'] = row[1]['Cost']

		# ===== Check translation information =====
		if nb(row[1]['Translation Available']):
			service['translation_available'] = row[1]['Translation Available']

		# ===== Check United Way approval information =====
		if nb(row[1]['United Way Approval']):
			uwa = check_and_recover_yn(
				row[1]['United Way Approval'],
				f'United Way Approval on line {index}',
				batch
			)

			if uwa == 1:
				service['united_way_approval'] = True
			elif uwa == -1:
				service['united_way_approval'] = False
			else:
				print('  ERR: Could not recover field "United Way Approval". Ignoring this field.')
				problem = True

		# ===== Check additional information =====
		if nb(row[1]['Additional Information']):
			service['additional_information'] = row[1]['Additional Information']

		if problem:
			print(f'WARN: service {service["name"]} on line {index+3} encountered non-fatal errors.')
			warn_services += 1
		parsed_services.append(service)

	print('\n===== Parsing complete =====\n'
		+ f'\nParsed {len(parsed_services)}.\n' 
		+ f'  > {err_services} were discarded due to fatal errors\n'
		+ f'  > {warn_services} encountered non-fatal errors and may '
		+ f'need to be manually reviewed.'
	)
	return parsed_services

def db_upload(proto, host, auth_db, db, user, pwd, to_upload, batch=True):
	print('\n===== Beginning database operations =====\n')
	constructed_url = f'{proto}://{quote_plus(user)}:{quote_plus(pwd)}@{host}/{auth_db}'
	print('Connecting to database...', end='', flush=True)
	client = pymongo.MongoClient(constructed_url) 
	db_obj = client[db]
	print('Connected.')

	print('\nRetrieving and processing categories', end='', flush=True)
	cats_col = db_obj['categories']
	cats = {}
	for cat in cats_col.find():
		print('.', end='', flush=True)
		if '__doc_index' in cat:
			cats[cat['__doc_index']] = cat['_id']
	print('Done.')
	#print(cats)

	print('\nAssociating categories to services', end='', flush=True)
	for svc in to_upload:
		print('.', end='', flush=True)
		if 'categories' in svc.keys():
			#print(f'\nService has cats {svc["categories"]}')
			new_cat_list = []
			for cat_offset in svc['categories']:
				#print(f'{cat_offset} -> {cats[cat_offset]}')
				new_cat_list.append(cats[cat_offset])
			svc['categories'] = new_cat_list
	print('Done.')

	print('\nUploading information...', end='', flush=True)
	svc_col = db_obj['services']
	svc_col.insert(to_upload)
	print('Done.')

	print('\n===== Upload complete =====\n'
		+ f'\nUploaded {len(to_upload)}.'
	)
	

def main():
	args = load_parser().parse_args()

	conf = {
		'spreadsheet': None,
		'batch_mode': False,
		'db': {
			'proto': None,
			'host': None,
			'auth_db': None,
			'db': None,
			'user': None,
			'pwd': None
		}
	}

	if args.config_file:
			with open(args.config_file) as jfile:
				fdata = json.load(jfile)
				if 'spreadsheet' in fdata:
					conf['spreadsheet'] = fdata['spreadsheet']
				if 'batch_mode' in fdata:
					conf['batch_mode'] = fdata['batch_mode']
				if 'db' in fdata:
					if 'proto' in fdata['db']:
						conf['db']['proto'] = fdata['db']['proto']
					if 'host' in fdata['db']:
						conf['db']['host'] = fdata['db']['host']
					if 'auth_db' in fdata['db']:
						conf['db']['auth_db'] = fdata['db']['auth_db']
						conf['db']['db'] = fdata['db']['auth_db']
					if 'db' in fdata['db']:
						conf['db']['db'] = fdata['db']['db']
					if 'user' in fdata['db']:
						conf['db']['user'] = fdata['db']['user']
					if 'pwd' in fdata['db']:
						conf['db']['pwd'] = fdata['db']['pwd']

	if 'MONGODB_PASSWORD' in os.environ:
		conf['db']['pwd'] = os.environ['MONGODB_PASSWORD']

	if args.mongodb_user:
		conf['db']['user'] = args.mongodb_user
	
	if args.mongodb_password:
		conf['db']['pwd'] = args.mongodb_password

	if args.mongodb_proto:
		conf['db']['proto'] = args.mongodb_proto
	
	if args.mongodb_host:
		conf['db']['host'] = args.mongodb_host
	
	if args.mongodb_auth_db:
		conf['db']['auth_db'] = args.mongodb_auth_db
		conf['db']['db'] = args.mongodb_auth_db
	
	if args.mongodb_db:
		conf['db']['db'] = args.mongodb_db
	
	if args.file:
		conf['spreadsheet'] = args.file
	
	if args.batch:
		conf['batch_mode'] = True
	
	if conf['batch_mode']:
		if not (conf['spreadsheet'] \
				and conf['db']['proto'] \
				and conf['db']['host'] \
				and conf['db']['auth_db'] \
				and conf['db']['db'] \
				and conf['db']['user'] \
				and conf['db']['pwd']):
			print('ERROR: Missing information, and batch mode is specified.')
			os.exit(1)
		else:
			print('NOTE: Running in batch mode. Interactive functionality disabled.')
	else:
		if not conf['spreadsheet']:
			conf['spreadsheet'] = input('File name > ')
		if not conf['db']['proto']:
			conf['db']['proto'] = input('Database protocol (mongodb or mongodb+srv) > ')
		if not conf['db']['host']:
			conf['db']['host'] = input('Raw database hostname (no protocol or auth-db) > ')
		if not conf['db']['auth_db']:
			conf['db']['auth_db'] = input('Authentication database > ')
		if not conf['db']['db']:
			conf['db']['db'] = input('Database to operate on > ')
		if not conf['db']['user']:
			conf['db']['user'] = input('Database username > ')
		if not conf['db']['pwd']:
			conf['db']['pwd'] = input('Database password > ')
	
	parsed = parse_spreadsheet(conf['spreadsheet'], conf['batch_mode'])
	db_upload(conf['db']['proto'], conf['db']['host'], conf['db']['auth_db'], conf['db']['db'], conf['db']['user'], conf['db']['pwd'], parsed, conf['batch_mode'])

main()
