import React, { useState, useEffect } from "react";
import axios from 'axios';
import { Link } from "react-router-dom";
import Moment from 'react-moment';
import "../App.css";
import {
  Container,
  Row,
  Col,
  Card,
  CardText,
  CardBody,
  CardTitle,Button,
  CardSubtitle,Jumbotron
} from "reactstrap";

const Post = (props) => (
  
  <Col xs="12" md="12">
  <Link to={'/blogs/'+props.post._id}>
    <Card className="Card">
      <CardBody>
        <CardSubtitle className="text-secondary"><Moment>{props.post.date}</Moment></CardSubtitle>

        <CardText className="CardText">
          {props.post.title} 
        </CardText>
      </CardBody>
    </Card>
    </Link>
  </Col>
);



function Homepage() {
  /// inital STATe
  const [posts, setPosts] = useState([]);
 // console.log(posts)

  useEffect(() => {
    axios
      .get("http://localhost:8080/api/blogs")
      .then(function (res) {
        const data= res.data;
       setPosts(data);
        //console.log(data);
      })
      .catch(function (error) {
        console.log(error);
      });
  }, []);

  const postList =()=>{
    return posts.map(post => {
      return <Post post={post} />
    })
  }


  return (
    <div>
      <Jumbotron>
        <h1 className="display-3">Hello, world!</h1>
        <p className="lead">This is a simple Tech blog made as part of an Odin Project</p>
        <hr className="my-2" />
    
      </Jumbotron>
    <Container>
     
      <Row>
       {postList()}
      </Row>
    </Container>
    </div>
  );
}

export default Homepage;
