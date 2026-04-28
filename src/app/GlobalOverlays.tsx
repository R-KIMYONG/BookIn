'use client';

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import SessionModalContainer from '@/components/session/SessionModalContainer';
import BookmarkMemoContainer from '@/components/bookmark/BookmarkMemoContainer';
import { Suspense } from 'react';

const GlobalOverlays = () => {
  return (
    <>
      <ToastContainer autoClose={1000} stacked draggable />
      <SessionModalContainer />
      <Suspense fallback={null}>
        <BookmarkMemoContainer />
      </Suspense>
    </>
  );
};

export default GlobalOverlays;
