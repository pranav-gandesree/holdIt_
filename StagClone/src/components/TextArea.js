import React , { useState, useRef, useEffect }from 'react'
import Editor from '@monaco-editor/react';
import axios from 'axios';
import '../index.css'

export default function TextArea({ setTextValue  }) {
  const [editorValue, setEditorValue] = useState("//some comment");
    const editorRef = useRef(null);

    function handleEditorDidMount(editor, monaco) {
      editorRef.current = editor;
      editor.updateOptions({ wordWrap: "on" })
    }

        useEffect(() => {
        const path = window.location.pathname.replace(/^\/|\/$/g, ''); 
        axios.get(`http://localhost:4000/api/v1/${path}`)
            .then(response => {
                setEditorValue(response.data.text || "//some comment");
                console.log(response.data);
            })

            .catch(error => {
                console.error("Error fetching data:", error);
            });
    }, []);


  function debounce(fn,time){
    var timer;
    return function(){
      clearTimeout(timer);
      timer=setTimeout(()=>{fn.apply(this,arguments)},time);
    }
  }

  function handleChange(newValue){
    // let txt=editorRef.current.getValue();
    setTextValue(newValue);
    setEditorValue(newValue);
    console.log("newvalue:" + newValue);
  }

  useEffect(() => {
    // Check if editor value is empty and set default value if true
    if (editorValue.trim() === "") {
      setEditorValue("// some comment");
    }
  }, [editorValue]);

  return (
    <div className='flex justify-center bg-slate-900 h-screen'>
    <Editor
        height="90vh"
        className='editor'
        width="100%" 
        theme= "vs-dark"
        // defaultLanguage="javascript"
        defaultValue={editorValue}
        loading="Loading..."
        onMount={handleEditorDidMount}
        onChange={debounce(handleChange,1500)}
        options={{
          fontSize:16,
          minimap:{
            enabled:false
          }
        }}
      />
      {/* <textarea id="w3review" name="w3review" rows="4" cols="50">
At w3schools.com you will learn how to make a website. They offer free tutorials in all web development technologies.
</textarea> */}
    </div>
  )
}





// import React, { useState, useRef, useEffect } from 'react';
// import Editor from '@monaco-editor/react';
// import axios from 'axios';
// import '../index.css';

// export default function TextArea({ setTextValue }) {
//     const [editorValue, setEditorValue] = useState("//some comment");
//     const editorRef = useRef(null);


//       useEffect(() => {
//         const path = window.location.pathname.replace(/^\/|\/$/g, ''); 
//         axios.get(`http://localhost:4000/api/v1/${path}`)
//             .then(response => {
//                 setEditorValue(response.data.text || "//some comment");
//             })
//             .catch(error => {
//                 console.error("Error fetching data:", error);
//             });
//     }, []);


//     function handleEditorDidMount(editor, monaco) {
//         editorRef.current = editor;
//         editor.updateOptions({ wordWrap: "on" });
//     }

//     function debounce(fn, time) {
//         var timer;
//         return function () {
//             clearTimeout(timer);
//             timer = setTimeout(() => { fn.apply(this, arguments); }, time);
//         }
//     }

//     function handleChange(newValue) {
//         // let txt=editorRef.current.getValue();
//         setTextValue(newValue);
//         setEditorValue(newValue);
//         console.log("newvalue:" + newValue);
//     }

//     useEffect(() => {
//         // Check if editor value is empty and set default value if true
//         if (editorValue.trim() === "") {
//             setEditorValue("// some comment");
//         }
//     }, [editorValue]);

//     return (
//         <div>
//             <Editor
//                 height="90vh"
//                 className='editor'
//                 width="100%"
//                 theme="vs-dark"
//                 // defaultLanguage="javascript"
//                 defaultValue={editorValue}
//                 loading="Loading..."
//                 onMount={handleEditorDidMount}
//                 onChange={debounce(handleChange, 1500)}
//                 options={{
//                     fontSize: 16,
//                     minimap: {
//                         enabled: false
//                     }
//                 }}
//             />
//         </div>
//     );
// }




