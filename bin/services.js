const mongoose = require('mongoose');
const Services = require('../models/services');
const Provider = require('../models/provider');

const dbtitle = 'Socialite2';
mongoose.connect(`mongodb://localhost/${dbtitle}`);
Services.collection.drop();
Provider.collection.drop();

const services = [
  {
    title: "Botox",
    description: "Botox Injections.",
    provider: { "name": "Heidi",
              "lastName": "Schuler ARNP",
              "pictureUrl": ".../images/Heidi.jpeg"
            },
    rating: 10
  },
  {
    title: "Pret A Porter/Ready To Wear",
    description: "Fashion.",
    provider: { "name": "Rene",
              "lastName": "Ruiz",
              "pictureUrl": ".../images/Rene.jpg"
            },
    rating: 9
  },
  {
    title: "Couture",
    description: "Fashion.",
    author: { "name": "Rene",
              "lastName": "Ruiz",
              "pictureUrl": ".../images/Rene.jpg"
            },
    rating: 8
  },
  {
    title: "Pride and Prejudice",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
    author: { "name": "Jane",
              "lastName": "Austen",
              "nationality": "English",
              "birthday": new Date(1817,11,16),
              "pictureUrl": "https://www.biography.com/.image/t_share/MTE1ODA0OTcxNTQ2ODcxMzA5/jane-austen-9192819-1-402.jpg"
            },
    rating: 9
  },
  {
    title: "Twilight",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
    author: { "name": "Sthephenie",
              "lastName": "Meyer",
              "nationality": "American",
              "birthday": new Date(1973,11,24),
              "pictureUrl": "https://upload.wikimedia.org/wikipedia/commons/thumb/6/63/Stephenie_Meyer_by_Gage_Skidmore.jpg/1200px-Stephenie_Meyer_by_Gage_Skidmore.jpg"
            },
    rating: 10
  },
 
  
];

const createProvider = services.map(book => {
  const newProvider = new Provider(services.provider);
  return newProvider.save()
  .then(provider => {
    return provider.name;
  })
  .catch(error => {
    throw new Error(`Unable to add provider. ${error}`);
  });
});


let findProvider = Promise.all(createProvider)
  .then(provider => {
    return services.map(book => {
       return Provider.findOne({name: services.provider.name, lastName: services.provider.lastName})
        .then(provider => {
          if (!provider) {
            throw new Error(`unknown provider ${services.provider.name} ${services.provider.lastName}`);
          }
          return Object.assign({}, services, {provider: provider._id});
        });
    });
})
.catch(error => {
  throw new Error(error);
});

const saveServices = findProviders.then(findProviders => {
  return Promise.all(findProviders)
  .then(services => {
    //console.log('services are here: ', services);
    return services.map(book => {
      const newServices = new Services(services);
      console.log('newServices =', newServices);
      return newServices.save();
    });
  });
}).then(savedServices => {
  console.log('savedServices ', savedServices);
  Promise.all(savedServices)
  .then(books => {services.forEach(services => console.log(`created ${services.title}`)); 
        mongoose.connection.close();
      })
  .catch(err => console.log("papu",err));
});