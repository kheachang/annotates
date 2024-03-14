require('dotenv').config();
import { useEffect, useState } from "react";
import { api } from "~/utils/api";
import { env } from "../env.js";
import { decideSearchType, searchText } from "~/utils/helpers.jsx";

export default function Home() {
  const [text, setText] = useState('');
  const [selectedText, setSelectedText] = useState('');
  const [popupPosition, setPopupPosition] = useState({ x: 0, y: 0 });
  const [additionalInfo, setAdditionalInfo] = useState([]);

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

  useEffect(() => {
    const result = async () => {
      try {
        const res = await searchText(selectedText);
        if (res && res.results) {
          // const titles = res.results.map(r => r.title)
          setAdditionalInfo(res.results)
        } else {
          setAdditionalInfo([]);
        }
      } catch (error) {
        console.error("Failed to fetch results: ", error);
      }
    };
    result();
  }, [selectedText]);

  return (
    <>
      <div id="pop-up">
        <h1>Search results for: {selectedText}</h1>
        <div>
          {additionalInfo.length > 0 ? (
            <ul>
              {additionalInfo.map((item, index) => (
                <li key={index}>
                  <h3>{item.title}</h3>
                  <p>URL: <a href={item.url} target="_blank" rel="noopener noreferrer">{item.url}</a></p>
                  <p>Published Date: {item.publishedDate || 'N/A'}</p>
                  <p>Author: {item.author || 'Unknown'}</p>
                </li>
              ))}
            </ul>
          ) : (
            <p>No results found.</p>
          )}
        </div>
        <br></br>
        <p></p>
      </div>
      <br></br>
      <p>{text}</p>
    </>
  );
}