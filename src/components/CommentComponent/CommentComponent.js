import React, { useEffect, useState } from "react";
import {
  Button,
  Form,
  FormGroup,
  FormControl,
  OverlayTrigger,
  Tooltip
} from "react-bootstrap";
import { CommentObj } from "../../models/commonModels";
import { Edit3, Reply, Trash2 } from "lucide-react";
import { format } from "date-fns";
import { checkNullUndefined } from "../../Shared/utils";

const CommentComponent = ({ data, ...props }) => {
  const [commentData, setCommentData] = useState({ ...data });
  const [addReply, setAddReply] = useState(false);
  const [formData, setFormData] = useState({});
  const [validated, setValidated] = useState(false);

  const [editMode, setEditMode] = useState(null);

  useEffect(() => setCommentData(JSON.parse(JSON.stringify(data))), [data]);

  const twoWayBind = (key, value) => {
    setFormData({
      ...formData,
      [key]: value
    });
  };

  const handleSubmitForm = (event) => {
    event.stopPropagation();
    event.preventDefault();
    const form = event.target;
    if (form.checkValidity()) {
      if (checkNullUndefined(editMode)) {
        const newData = {
          ...commentData,
          replies: [
            ...data.replies,
            CommentObj(
              formData.comment,
              `${commentData.id}_${commentData.replies.length}`,
              `${commentData.id}`
            )
          ]
        };
        replyComment(newData);
      } else {
        console.log("update 1.0", {
          ...commentData,
          comment: formData.comment,
          updatedAt: new Date()
        });
        handleUpdate(event);
      }
      setValidated(false);
    } else {
      setValidated(true);
    }
  };

  //Reply to existing comments
  const replyComment = (commentReply) => {
    const tempData = {
      ...commentData,
      replies: [...commentData.replies]
    };
    const commentIndex = tempData?.replies?.findIndex(
      (item) => item.id === commentReply.id
    );
    if (props.addReply) {
      if (commentIndex > -1) {
        tempData.replies.splice(commentIndex, 1, commentReply);
        props.addReply(tempData);
      } else {
        props.addReply(commentReply);
      }
    } else if (commentReply && props.replyComment) {
      if (commentIndex > -1) {
        tempData.replies.splice(commentIndex, 1, commentReply);
        props.replyComment(tempData);
      } else {
        // console.log(commentReply, 3);
        props.replyComment(commentReply);
      }
    }
    setAddReply(false);
    setFormData({});
  };

  const handleDelete = (event) => {
    event.stopPropagation();
    event.preventDefault();
    if (props.deleteComment) {
      return props.deleteComment(null);
    } else {
      return props.deleteReply(
        {
          ...commentData,
          replies: [...commentData.replies]
        },
        commentData.id
      );
    }
  };

  // Reply to existing comments
  const deleteReply = (commentReply, deletedCommentId) => {
    const tempData = {
      ...commentData,
      replies: [...commentData.replies]
    };
    const commentIndex = commentData.replies.findIndex(
      (item) => item.id === commentReply.id
    );
    const deletedIndex = commentData.replies.findIndex(
      (item) => item.id === deletedCommentId
    );
    if (props.deleteComment) {
      if (deletedIndex > -1) {
        tempData.replies.splice(commentIndex, 1);
        return props.deleteComment(tempData);
      } else {
        tempData.replies.splice(commentIndex, 1, commentReply);
        return props.deleteComment(tempData);
      }
    } else if (props.deleteReply) {
      if (deletedIndex > -1) {
        tempData.replies.splice(commentIndex, 1);
        return props.deleteReply(tempData);
      } else {
        tempData.replies.splice(commentIndex, 1, commentReply);
        return props.deleteReply(tempData);
      }
    }
  };

  const handleUpdate = (event) => {
    event.stopPropagation();
    event.preventDefault();
    props.updateReply(
      {
        ...commentData,
        comment: formData.comment,
        updatedAt: new Date()
      },
      commentData.id
    );
    setAddReply(false);
    setEditMode(null);
    setFormData({});
  };

  const updateReply = (updatedComment, updatedCommentId) => {
    const tempData = {
      ...commentData,
      replies: [...commentData.replies]
    };
    const commentIndex = commentData.replies.findIndex(
      (item) => item.id === updatedComment.id
    );
    const updatedIndex = commentData.replies.findIndex(
      (item) => item.id === updatedCommentId
    );
    if (props.updateComment) {
      tempData.replies.splice(commentIndex, 1, updatedComment);
      return props.updateComment(tempData);
    } else if (props.updateReply) {
      if (updatedIndex > -1) {
        tempData.replies.splice(updatedIndex, 1, updatedComment);
        return props.updateReply(tempData);
      } else {
        tempData.replies.splice(commentIndex, 1, updatedComment);
        return props.updateReply(tempData);
      }
    }
  };

  const toggleUpdate = (event) => {
    event.stopPropagation();
    event.preventDefault();
    if (checkNullUndefined(editMode)) {
      setAddReply(true);
      setFormData({ ...commentData });
      setEditMode(commentData.id);
    } else {
      setAddReply(false);
      setFormData({});
      setEditMode(null);
    }
  };

  return (
    <>
      <div className="comments-div">
        <span className="font-subtle" style={{ minWidth: "40px" }}>
          {"level " + commentData?.id?.toString().split("_")?.length}
        </span>
        <span className="comment" style={{ minWidth: "50%" }}>
          {commentData.comment}
        </span>
        <span className="font-subtle">
          {format(new Date(commentData.timestamp), "hh:mm aaaa")}
        </span>
        <div className="d-flex justify-content-between mx-1">
          <div>
            <OverlayTrigger placement={"top"} overlay={<Tooltip>Edit</Tooltip>}>
              <Edit3
                role="button"
                size={16}
                onClick={(event) => {
                  toggleUpdate(event);
                }}
              />
            </OverlayTrigger>
          </div>
          <div>
            <OverlayTrigger
              placement={"top"}
              overlay={<Tooltip>Delete</Tooltip>}
            >
              <Trash2
                className="text-danger mx-1"
                role="button"
                size={16}
                onClick={(event) => {
                  handleDelete(event);
                }}
              />
            </OverlayTrigger>
          </div>
          <div>
            <OverlayTrigger
              placement={"top"}
              overlay={<Tooltip>Reply</Tooltip>}
            >
              <Reply
                className="text-primary"
                role="button"
                size={16}
                onClick={(event) => {
                  setAddReply(!addReply);
                }}
              />
            </OverlayTrigger>
          </div>
        </div>
      </div>
      {addReply ? (
        <>
          <Form
            className="d-flex mx-4"
            noValidate
            validated={validated}
            onSubmit={(event) => {
              handleSubmitForm(event);
              // replyComment(event);
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
                placeholder="enter reply"
              />
              <Form.Control.Feedback type="invalid">
                Enter a valid comment
              </Form.Control.Feedback>
            </FormGroup>
            <div>
              <Button
                type="submit"
                className="mx-2 btn-sm"
                variant="outline-primary"
              >
                {checkNullUndefined(editMode) ? "Add reply" : "Update"}
              </Button>
            </div>
          </Form>
        </>
      ) : null}
      {commentData.replies.map((item) => (
        <div className="ms-4">
          <CommentComponent
            data={item}
            updateReply={updateReply}
            deleteReply={deleteReply}
            replyComment={replyComment}
          />
        </div>
      ))}
    </>
  );
};

export default CommentComponent;
