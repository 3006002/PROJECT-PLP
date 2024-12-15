 

const express = require('express');
const app = express();
 

const bodyparser = require('body-parser');
const path = require('path');

app.use(bodyparser.urlencoded({ extended: false }));
app.use(bodyparser.json());
app.use(express.static(path.join(__dirname, 'public')));

let expenses = [];


 

//create an expense
app.post("/api/expenses", (req, res) => {
     try { 
        const { category, description, amount } = req.body;
   if (!category || !description || !amount) {
    return res.status(400).json({ error: "Fill the form" }); 
   }
    
     
    // Calculate new ID based on the last expense, if any
    const newId = expenses.length > 0 ? expenses[expenses.length - 1].id + 1 : 1;
    const newExpense = {
        id:newId,
        category,
        description,
        amount: parseFloat(amount),
    };
    
    expenses.push(newExpense);
    res.status(201).json(newExpense); 
} catch (error) {
    console.error("Error processing request:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Serve the home.html file when visiting the root URL
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "home.html"));
});

//read all expenses
app.get("/api/expenses", (req, res) => {
    res.json(expenses);

});

//reading a single expense
app.get("/api/expenses/:id", (req, res) => {
    const id = parseInt(req.params.id) //collects specific id parameter
    const expense = expenses.find((expense) => expense.id === id);
    if (!expense) {
        return res.status(404).send("Expense not found");
    }
    res.json(expense);
});
// update an expense
app.put("/api/expenses/:id", (req, res) => {
    const id = parseInt(req.params.id);
    const { category, description, amount } = req.body;

  const expenseIndex = expenses.findIndex((expense) => expense.id === id);
  if (expenseIndex === -1) {
    return res.status(404).send("Expense not found");
  }
    
    // Validating the updated data
    if (!category || !description || isNaN(amount)) {
        return res.status(400).json({ error: "Invalid input data" });
    }
    expenses[expenseIndex] = { id, category, description, amount: parseFloat(amount) };
  res.json(expenses[expenseIndex]);

     
});


//delete an expense
app.delete("/api/expenses/:id", (req, res) => {
    const id = parseInt(req.params.id);
    const expenseIndex = expenses.findIndex((expense) => expense.id === id);
    if (expenseIndex === -1) {
        return res.status(404).send("Expense not Found")// search by the id
    }

    expenses = expenses.filter((expense) => expense.id !== id);// deleting
    res.json({ message: "Expense Deleted" }); 
});



 // Calculate the total expense
  // Calculate the total expense
  app.get("/api/expense", (req, res) => {
    const totalExpense = expenses.reduce((total, expense) => total + expense.amount, 0);
    res.json({ totalExpense });
  });



 


module.exports = app;
