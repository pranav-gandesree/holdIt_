import React, { useState, useEffect } from 'react'
import '../index.css'

export default function Table() {

  let arr = [
    [1, 2, 3],
    [4, 5, 6],
    [7, 8, 9],
    [10, 11, 12]
  ]

  let arrObj = [
    [{ value: "1" }, { value: "2" }, { value: 3 }],
    [{ value: 4 }, { value: 5 }, { value: 6 }],
    [{ value: 7 }, { value: 8 }, { value: 9 }],

  ]

  const [data, setData] = useState(arr)
  const [heading, setHeading] = useState(['Sno', 'Head2', "Head3", "head4"])

  const [table, setTable] = useState(<tr>
    <th scope="row">1</th>
    <td contentEditable="true">77</td>
    <td contentEditable="true">john</td>
    <td contentEditable="true">kaun</td>
  </tr>)

  // useEffect( (data)=>{
  //     return {
  //         newRow=Wrap(data)
  //     }
  // },[data] )


  function Wrap(arr) {
    console.log(arr);
    let dup = arr.map((r, rowIndex) => {

      return (<tr>
        <th scope="row">{rowIndex}</th>
        <td contentEditable="true">{r[0]}</td>
        <td contentEditable="true">{r[1]}</td>
        <td contentEditable="true">{r[2]}</td>
      </tr>)

    })
    // console.log(dup);
    setTable(dup);

  }

  function AddRow() {
    let newData = [...data, [null, null, ""]];
    setData(newData)
    Wrap(data)
  }


  return (
    <div className='excel'>
      <button onClick={() => Wrap(arr)}>Click here</button>
      <button onClick={() => AddRow()}>AddRow</button>
      <table className="table table-success  table-bordered">

        {
          heading.map((head) => {
            return (<th contentEditable="true">{head}</th>)
          })
        }

        <tbody>
          {table}
        </tbody>
      </table>
    </div>
  )
}
