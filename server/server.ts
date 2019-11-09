import expresss from './config/expresss';

// Use env port or default
const port = process.env.PORT || 5000;

// expresss.init();
expresss.listen(port, () => console.log(`Server now running on port ${port}!`));
