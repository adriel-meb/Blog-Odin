import React,{useState, useEffect} from "react";
import {
  ListGroup,
  ListGroupItem,
  ListGroupItemHeading,
  ListGroupItemText,
  Button,
  Form,
  FormGroup,
  Label,
  Input
} from "reactstrap";
import "../App.css";
import axios from 'axios';
import { v4 as uuid } from "uuid";

const Comment= (props) =>(
    <ListGroupItem >
    <ListGroupItemHeading>{props.el.title}</ListGroupItemHeading>
    <ListGroupItemText>{props.el.date}</ListGroupItemText>
    <ListGroupItemText>{props.el.body}</ListGroupItemText>
  </ListGroupItem>
)

export default function Comments({id}) {
    const [comment, setComment]=useState([]);
    const [title, setTitle]=useState('');
    const [body, setBody]=useState('');



    //RETRIEVE COMMENTS FROM DATABASE
     useEffect(() => {
      getBlogPost()
      }, []);


        //Get data from server
  const getBlogPost = () =>{
    axios("http://localhost:8080/api/blogs/"+id+"/comments")
    .then((response) => {
      const data= response.data;
      setComment(data)
      console.log('data has been received',data)
    })
    .catch((err) => { console.log('error retrieving data',err)}) 
    };
  

 

      const commentList= () =>{
        return comment.map(el =>{
           return  <Comment el={el} key={uuid()} />
        })
    }


  

    ///HANDLE FORM submit
    const handleForm =(e) =>{
      e.preventDefault();
      const newComment ={title,body }
      //console.log(comment)

      axios.post("http://localhost:8080/api/blogs/"+id+"/comments", newComment)
      .then(function (response) {
        resetUserInputs();
        getBlogPost();
        console.log(response);
      })
      .catch(function (error) {
        console.log(error);
      });

    }

      ///Form reset handler
  const resetUserInputs = () =>{
    setTitle('')
    setBody('')
  }



  return (
    <div className="CommentContainer">
      <h4 className="mb-4"> Comments </h4>

      <ListGroup >
        {
          comment.length<=0? "no comments yet..." : commentList()
        }
      </ListGroup>

      <Form className='CommentForm' onSubmit={handleForm}>
      <h6>Please leave a comment: </h6>
      <FormGroup>
        <Label for="title">Title</Label>
        <Input type="text" name="title" id="title" placeholder="Enter the title of the comment" onChange={(e) => setTitle(e.target.value)}/>
      </FormGroup>
 
      <FormGroup>
        <Label for="body">Text Area</Label>
        <Input type="textarea" name="body" id="body" onChange={(e) => setBody(e.target.value)}/>
      </FormGroup>
      <Button>Submit</Button>
    </Form>
    </div>
  );
}
