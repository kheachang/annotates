import { useEffect, useState } from "react";

import { api } from "~/utils/api";

export default function Home() {
  const [text, setText] = useState('');
  const [selectedText, setSelectedText] = useState('');
  const [popupPosition, setPopupPosition] = useState({ x: 0, y: 0 });

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