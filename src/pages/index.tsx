require('dotenv').config();
import { useEffect, useState } from "react";
import Exa from 'exa-js';
import { api } from "~/utils/api";
import { env } from "../env.js";
import { decideSearchType } from "~/utils/helpers.jsx";

export default function Home() {
  const [text, setText] = useState('');
  const [selectedText, setSelectedText] = useState('');
  const [popupPosition, setPopupPosition] = useState({ x: 0, y: 0 });
  const exaApiKey = env.NEXT_PUBLIC_EXA_API_KEY;
  const exa = new Exa(exaApiKey);
  

  useEffect(() => {
    async function fetchText() {
      try {
        const response = await fetch('/text.txt'); // Access the text file from the public directory
        const data = await response.text();
        setText(data);
      } catch (error) {
        console.error('Error fetching text:', error);
      }
    }

    fetchText();
  }, []);

  useEffect(() => {
    const handleHighlightedText = () => {
      const selection = window.getSelection();
      const popup = document.getElementById('pop-up');
      if (selection && !selection.isCollapsed) {
        const selectedText = selection.toString().trim();
        setSelectedText(selectedText);
        popup.classList.add('active');
      } else {
        popup.classList.remove('active');
      }
    };
    document.addEventListener('mouseup', handleHighlightedText);
    return () => {
      document.removeEventListener('mouseup', handleHighlightedText);
    }
  }, []);

  (async () => {
    console.log(selectedText, ':', await decideSearchType(selectedText));
  })();

  return (
    <>
      <h1>Highlight text for more info: {selectedText}</h1>
      <div id="pop-up">
        <p>{selectedText}</p>
      </div>
      <br></br>
      <p>{text}</p> {/* Render the text file content */}
    </>
  );
}