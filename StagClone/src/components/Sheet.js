// const http=require('http')
// const fs=require('fs')
// const mongoose=require('mongoose')

// import React,{useState} from 'react'
// import Spreadsheet from "react-spreadsheet";
// export default function Sheet() {

//   // const [data, setData] = useState([
//   //   [{ value: "Vanilla" }, { value: "Chocolate" }, { value: "" }],
//   //   [{ value: "Strawberry" }, { value: "Cookies" }, { value: "" }],
//   // ]);


//   const [data,setData]=  useState([ [{value:""},{value:""},{value:""},{value:""} ] ])  ;
// const [cols,setLable]=useState(["sno","name","age","phone","luffy"])

// function handleClick(){
//   const newRow=[[{value:""},{value:""},{value:""},{value:""} ]];
//   const updatedRow=[...data,newRow];
//   setData(updatedRow);
// }

// function AddCol(){
//   const newCol=[""]
//   const updatedCols=[...cols,newCol]
//   setLable(updatedCols);
// }

// function Save(){
//   //store in mongo db

//   const mySchema=new mongoose.Schema({sno:Number,name:String,Age:Number});
//   const mydocument=mongoose.model(collecname,mySchema);
//   const obj=new mydocument({sno:77,name:"alloo",Age:67 })
//   //save the obj
//   await.obj()

//   //find the document
//   const allDoc=mydocument.find()
//   for(e of allDoc){
//     console.log(e);
//   }
// }
  
//   return (
// <>
// <button onClick={handleClick}>Add row</button>
// <button onClick={AddCol}>Add Cols</button>
// <button onClick={Save}>Save</button>

//     <div><Spreadsheet 
//     data={data}
//     onChange={setData}
//     columnLabels={cols}

//     // onSelectCell={handleCellClick}
//     /></div>
     
// </>

//   )
// }








import React, { useState, useEffect } from 'react';
import Spreadsheet from "react-spreadsheet";
import mongoose from 'mongoose'; // Assuming correct import path for Mongoose

const INITIAL_DATA = [
  [{ value: "" }, { value: "" }, { value: "" }, { value: "" }, { value: "" }],
  [{ value: "" }, { value: "" }, { value: "" }, { value: "" }, { value: "" }],
];

const INITIAL_COLS = ["sno", "name", "age", "phone", "luffy"];

function Sheet() {
  const [data, setData] = useState(INITIAL_DATA);
  const [cols, setCols] = useState(INITIAL_COLS);

  // Connect to MongoDB on component mount (using useEffect)
  useEffect(() => {
    const connectToDb = async () => {
      try {
        await mongoose.connect('mongodb://localhost:27017/Testdb');
        console.log('Connected to MongoDB');
      } catch (error) {
        console.error('Error connecting to MongoDB:', error);
      }
    };

    connectToDb();
  }, []); // Empty dependency array to run only once on mount

  const handleClick = () => {
    const newRow = [{ value: "" }, { value: "" }, { value: "" }, { value: "" }, { value: "" }];
    const updatedRow = [...data, newRow];
    setData(updatedRow);
  };

  const AddCol = () => {
    const newCol = "";
    const updatedCols = [...cols, newCol];
    setCols(updatedCols);
  };

  const Save = async () => {
    if (!mongoose.connection.readyState) {
      console.error('Not connected to MongoDB yet. Please wait for connection.');
      return;
    }

    const mySchema = new mongoose.Schema({
      sno: Number,
      name: String,
      age: Number,
    });

    const MyModel = mongoose.model('YourCollectionName', mySchema); // Replace 'YourCollectionName' with your desired collection name

    for (const row of data) {
      const newData = {
        sno: parseInt(row[0].value, 10) || null, // Parse sno to Number with null fallback
        name: row[1].value,
        age: parseInt(row[2].value, 10) || null, // Parse age to Number with null fallback
      };

      try {
        const newDocument = new MyModel(newData);
        await newDocument.save();
        console.log('Document saved successfully:', newData);
      } catch (error) {
        console.error('Error saving document:', error);
      }
    }
  };

  return (
    <>
      <button onClick={handleClick}>Add row</button>
      <button onClick={AddCol}>Add Cols</button>
      <button onClick={Save}>Save</button>

      <div>
        <Spreadsheet
          data={data}
          onChange={setData}
          columnLabels={cols}
        />
      </div>
    </>
  );
}

export default Sheet;
