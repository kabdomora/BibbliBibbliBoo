import React, { useState, useEffect } from 'react';
import {
  Container,
  Card,
  Button,
  Row,
  Col
} from 'react-bootstrap';

// import { getMe, deleteBook } from '../utils/API';
import Auth from '../utils/auth';
import { removeBookId } from '../utils/localStorage';
import { useLazyQuery, useMutation } from '@apollo/client';
import { QUERY_ME } from '../utils/queries';
import { DELETE_BOOK } from '../utils/mutations';

const SavedBooks = () => {
  const [userData, setUserData] = useState({});
  const [oneUser] = useLazyQuery(QUERY_ME);
  const [deleteBook] = useMutation(DELETE_BOOK);

  // use this to determine if `useEffect()` hook needs to run again
  const userDataLength = Object.keys(userData).length;

  useEffect(() => {
    const getUserData = async () => {
      try {
        const token = Auth.loggedIn() ? Auth.getToken() : null;

        if (!token) {
          return false;
        }

        // const response = await getMe(token);

        // if (!response.ok) {
        //   throw new Error('something went wrong!');
        // }

        // const user = await response.json();

         // get userData through token
         const authResponse = Auth.getProfile(token);
         const user = authResponse.data;
 
         if (!user) {
           return false;
         }
 
         // get current user's saved books
         const {data} = await oneUser( 
           {
             variables: {
               id: user._id,
               username: user.username
             }
           }
         );

        // setUserData(user);
        setUserData(data.user);
      } catch (err) {
        console.error(err);
      }
    };

    getUserData();
  }, [userDataLength]);

  // create function that accepts the book's mongo _id value as param and deletes the book from the database
  const handleDeleteBook = async (bookId) => {
    const token = Auth.loggedIn() ? Auth.getToken() : null;

    if (!token) {
      return false;
    }

    // try {
    //   const response = await deleteBook(bookId, token);

    //   if (!response.ok) {
    //     throw new Error('something went wrong!');
    //   }

    //   const updatedUser = await response.json();
    const authResponse = Auth.getProfile(token);
    const user = authResponse.data;

    if (!user) {
      return false;
    }

    try {
      const { data } = await deleteBook({
        variables: {
          id: user._id,
          bookId: bookId
        }
      });


      // setUserData(updatedUser);
      setUserData(data.deleteBook);
      // upon success, remove book's id from localStorage
      removeBookId(bookId);
    } catch (err) {
      console.error(err);
    }
  };

  // if data isn't here yet, say so
  if (!userDataLength) {
    return <h2>LOADING...</h2>;
  }

  return (
    <>
      <div fluid className='text-light bg-dark p-5'>
        <Container>
          <h1>Viewing saved books!</h1>
        </Container>
      </div>
      <Container>
        <h2 className='pt-5'>
          {userData.savedBooks.length
            ? `Viewing ${userData.savedBooks.length} saved ${userData.savedBooks.length === 1 ? 'book' : 'books'}:`
            : 'You have no saved books!'}
        </h2>
        <Row>
          {userData.savedBooks.map((book) => {
            return (
              <Col md="4">
                <Card key={book.bookId} border='dark'>
                  {book.image ? <Card.Img src={book.image} alt={`The cover for ${book.title}`} variant='top' /> : null}
                  <Card.Body>
                    <Card.Title>{book.title}</Card.Title>
                    <p className='small'>Authors: {book.authors}</p>
                    <Card.Text>{book.description}</Card.Text>
                    <Button className='btn-block btn-danger' onClick={() => handleDeleteBook(book.bookId)}>
                      Delete this Book!
                    </Button>
                  </Card.Body>
                </Card>
              </Col>
            );
          })}
        </Row>
      </Container>
    </>
  );
};

export default SavedBooks;
