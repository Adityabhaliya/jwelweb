const express = require('express');
const cors = require('cors'); // 👈 Import CORS
const app = express();
const routes = require('./routes');
const { sequelize } = require('./models');
const path = require('path'); // Import path module

require('dotenv').config();

app.use(cors({
  origin: '*',  
  credentials: true
}));

app.use(express.json());

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

if (process.env.DB_SYNC === 'true') {
  sequelize.sync({ alter: true })
    .then(() => {
      console.log('Database synchronized');
    })
    .catch((error) => {
      console.error('Database synchronization failed:', error.message);
    });
}
app.use('/api', routes);

const PORT = process.env.PORT || 3000;

sequelize.sync({ alter: false }).then(() => {
  app.listen(PORT, () => console.log('Server running on port 3000 '));
});





/*
user side banner api is_block false hoy-------------  done
category api user main categoty is_block  is_home false ------------- done
admin side is_home key add karvani with validation 4 recoerds ------------- done
new arrival user side api is_new true hoy eva record product table ------------- done
copnatc na table is_subscribe  ------------- done
print now na buttin par click kare tyare ring size ni pd f download thase
faq ni user side api is_blosck false ------------- done
category listing inni api sub child wise user is_block ----------------done
globel search api product na table with pagiantion ================done
category wise product nu listing user side  ================done
proiduct details api sluig wiswe  ================done
recommadn proidyct list ================done

*/