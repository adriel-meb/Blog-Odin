
import React, { useState, useEffect } from "react";
import { useParams} from "react-router";
import axios from 'axios';
import {Container} from "reactstrap";
import Comments from "./Comments";

export default function SingleBlog(props) {
    ///Get URL parameter
    let {id} = useParams();
   
    ///DEfine steps
    const [post, setPost] = useState([]);
console.log(post['tags'])
    ///Collect the single post
    useEffect(() => {
        axios
          .get("http://localhost:8080/api/blogs/"+id)
          .then(function (res) {
            const data= res;
           setPost(data.data);
           // console.log(data.data);
          })
          .catch(function (error) {
            console.log(error);
          });
      }, []);


    return (
        <Container className="Container">
            <h1 className="Single_Post_Title">{post.title}</h1>

            {/* <h4 className="Single_Post_Tags">
            Tags: {post['tags']}
            </h4> */}

            <p className='Single_Post_Body'>{post.body}</p>

            <Comments id={id} />
        </Container>
    )
}
