import React, { useState } from 'react';

import classes from './AddMovie.module.css';
const AddProduct = (props) => {
    const [name, setName] = useState('');
    const [brand, setBrand] = useState('');
    const [price, setPrice] = useState('');
    const [description, setDescription] = useState('');
    const [category, setCategory] = useState('');
  
    function submitHandler(event) {
      event.preventDefault();
      const product = {name, description, brand, category, price}
      console.log(product)

      fetch ('http://localhost:3001/products', {
        method:'POST',
        headers:{"Content-Type": "application/json"},
        body: JSON.stringify(product)
      }).then(() => {
        console.log('new product added')
      })
  
      // could add validation here...
  
      
  
    }
  
    return (
      <form onSubmit={submitHandler}>
        <div className={classes.control}>
          <label htmlFor='title'>Name</label>
          <input type='text'  required id='title' required value={name} onChange= {(e)=> setName(e.target.value)} />
        </div>
        <div className={classes.control}>
          <label htmlFor='title'>Brand</label>
          <input type='text' id='title'  required value={brand} onChange= {(e)=> setBrand(e.target.value)} />
        </div>
        <div className={classes.control}>
          <label htmlFor='title'>Price</label>
          <input type='text' id='title' required value={price} onChange= {(e)=> setPrice(e.target.value)} />
        </div>
        <div className={classes.control}>
          <label htmlFor='opening-text'>Description</label>
          <textarea rows='5' id='opening-text'  required value={description} onChange= {(e)=> setDescription(e.target.value)}></textarea>
        </div>
        <div className={classes.control}>
          <label htmlFor='date'>Category</label>
          <input type='text' id='date'  required value={category} onChange= {(e)=> setCategory(e.target.value)} />
        </div>
        {/* <p> {name} {brand} {price} {description} {category} </p> */}
        <button >Add Product</button>
      </form>
    );
  }
  
  export default AddProduct;
  