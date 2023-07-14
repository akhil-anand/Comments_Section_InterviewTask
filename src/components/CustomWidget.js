import React, { useState } from "react";
import { Button, Form, FormControl, FormGroup } from "react-bootstrap";
import CommentComponent from "./CommentComponent/CommentComponent";
import { CommentObj } from "../models/commonModels";
import { SAVE_COMMENTS } from "../redux/commentReducer";
import { useSelector, useDispatch } from "react-redux";

const CustomWidget = () => {
  const dispatch = useDispatch();

  const { comments } = useSelector((state) => state);

  const [formData, setFormData] = useState({});
  const [validated, setValidated] = useState(false);

  const twoWayBind = (key, value) => {
    setFormData({
      ...formData,
      [key]: value
    });
  };

  const addComment = (event) => {
    event.preventDefault();
    event.stopPropagation();
    const form = event.target;
    const comment = formData.comment;
    if (form.checkValidity()) {
      dispatch(
        SAVE_COMMENTS([...comments, CommentObj(comment, comments.length, null)])
      );
      setFormData({});
      setValidated(false);
    } else {
      setValidated(true);
    }
  };

  //Reply to existing comments
  const addReply = (commentData) => {
    const commentIndex = comments.findIndex(
      (item) => item.id === commentData.id
    );
    const tempData = JSON.parse(JSON.stringify(comments));
    tempData.splice(commentIndex, 1, commentData);
    dispatch(SAVE_COMMENTS(tempData));
  };

  //Delete existing comments
  const deleteComment = (commentData) => {
    const commentIndex = comments.findIndex(
      (item) => item.id === commentData?.id
    );
    const tempData = JSON.parse(JSON.stringify(comments));
    if (commentData) {
      tempData.splice(commentIndex, 1, commentData);
    } else {
      tempData.splice(commentIndex, 1);
    }
    dispatch(SAVE_COMMENTS(tempData));
  };
  //Delete existing comments
  const updateComment = (commentData) => {
    const commentIndex = comments.findIndex(
      (item) => item.id === commentData?.id
    );
    const tempData = JSON.parse(JSON.stringify(comments));
    tempData.splice(commentIndex, 1, commentData);

    dispatch(SAVE_COMMENTS(tempData));
  };

  return (
    <div className="min-vh-100 d-flex align-items-center">
      <div className="border min-vw-75 rounded p-4 shadow align-items-center">
        <h4 className="fw-bold">Interview task</h4>
        <Form
          className="d-flex justify-content-center mb-2"
          noValidate
          validated={validated}
          onSubmit={(event) => {
            addComment(event);
          }}
        >
          <FormGroup className="text-start">
            <FormControl
              required
              size="sm"
              onChange={(event) => {
                twoWayBind("comment", event.target.value);
              }}
              value={formData?.comment ?? ""}
              placeholder="enter comment"
            />
            <Form.Control.Feedback type="invalid">
              Enter a valid comment
            </Form.Control.Feedback>
          </FormGroup>
          <div>
            <Button type="submit" className="mx-2 btn-sm">
              Comment
            </Button>
          </div>
        </Form>
        {comments?.map((item) => (
          <CommentComponent
            data={item}
            addReply={addReply}
            updateComment={updateComment}
            deleteComment={deleteComment}
          />
        ))}
      </div>
    </div>
  );
};

export default CustomWidget;
