const { query } = require("express");
const express = require("express");
const app = express();
const port = process.env.PORT || 3001;
const { Pool } = require("pg");

app.use(express.json());

const pool = new Pool({
  user: "riyaaz",
  host: "dpg-cefmi99gp3jk7mhomnhg-a.oregon-postgres.render.com",
  database: "cyf_ecommerce_i43p",
  password: "m35aBThruz4miC9Ak7Hsjdwgwy5qlxBt",
  port: 5432,
  ssl: { rejectUnauthorized: false },
});

app.get("/customers", (req, res) => {
  pool
    .query("SELECT * from customers c")
    .then((result) => res.json(result.rows))
    .catch((error) => {
      console.error(error);
      res.status(500).json(error);
    });
});

app.get("/suppliers", (req, res) => {
  pool
    .query("SELECT * from suppliers s")
    .then((result) => res.json(result.rows))
    .catch((error) => {
      console.error(error);
      res.status(500).json(error);
    });
});

// get all products or get a product by name.

app.get("/products", (req, res) => {
  let query =
    "SELECT p.product_name, pa.unit_price, s.supplier_name from products p inner join product_availability pa on p.id = pa.prod_id inner join suppliers s on pa.supp_id = s.id";
  let params = [];

  if (req.query.name) {
    query += " Where p.product_name = $1";
    params.push(req.query.name);
  }
  pool
    .query(query, params)
    .then((result) => res.json(result.rows))
    .catch((error) => {
      console.error(error);
      res.status(500).json(error);
    });
}); // End of get all products

// Load customer by id

app.get("/customers/:id", (req, res) => {
  const customerId = req.params.id;
  const query = "select * from customers where id = $1";

  pool
    .query(query, [customerId])
    .then((result) => res.json(result.rows))
    .catch((error) => {
      console.error(error);
      res.status(400).json(error);
    });
});

// Create a new customer
app.post("/customers", (req, res) => {
  const newName = req.body.name;
  const newAddress = req.body.address;
  const newCity = req.body.city;
  const newCountry = req.body.country;
  const query =
    "INSERT INTO customers (name, address, city, country) VALUES ($1, $2, $3, $4) RETURNING *;";
  console.log(req.body);
  pool
    .query(query, [newName, newAddress, newCity, newCountry])
    .then(() => res.send("Customer created!"))
    .catch((error) => {
      console.error(error);
      res.status(500).json(error);
    });
});

// create new product
app.post("/products", (req, res) => {
  const newProduct = req.body.product_name;
  const query = "INSERT INTO PRODUCTS (product_name) VALUES ($1)";

  pool
    .query(query, [newProduct])
    .then(() => res.send("Product created!"))
    .catch((error) => {
      console.error(error);
      res.status(500).json(error);
    });
});

app.listen(port, function () {
  console.log(
    `Server is listening on port ${port}. Ready to accept requests!`
  );
});
