import React, { useState, useEffect } from "react";
import "./App.css";
import debounce from "lodash.debounce";

let page_number;
let total;

function App() {
  const [data, updateData] = useState([]);
  const [isLoading, updateIsLoading] = useState(true);
  const [errorLoading, updateErrorLoading] = useState(false);
  const [hasEnded, updateEnded] = useState(false);

  useEffect(() => {
    page_number = 1;
    setTimeout(() => {
      fetch(`https://reqres.in/api/unknown?per_page=2`)
        .then(resp => resp.json())
        .then(resp => {
          total = resp.total_pages;
          updateData([...data, ...resp.data]);
          updateIsLoading(false);
        })
        .catch(err => updateErrorLoading(true));
    }, 1000);
  }, []);

  const loadItems = page => {
    setTimeout(() => {
      fetch(`https://reqres.in/api/unknown?per_page=2&page=${page}`)
        .then(resp => resp.json())
        .then(resp => {
          updateData([...data, ...resp.data]);
          updateIsLoading(false);
        })
        .catch(err => updateErrorLoading(true));
    }, 300);
  };

  window.onscroll = debounce(() => {
    updateIsLoading(true);
    if (
      window.innerHeight + document.documentElement.scrollTop ===
      document.documentElement.offsetHeight
    ) {
      page_number = page_number + 1;
      if (page_number > total) {
        updateEnded(true);
        return;
      }

      loadItems(page_number);
    }
  }, 100);

  return (
    <div className="App">
      <header className="App-header">
        <div className="Heading">INFINITE SCROLL</div>
        <>
          {data.map(item => {
            return (
              <div
                key={item.id}
                className="item"
                style={{ background: item.color }}
              >
                {`${item.id}. ${item.name}(${item.year})`}
              </div>
            );
          })}
          {errorLoading ? <div>Can't fetch data</div> : null}
          {hasEnded ? (
            <div>No more items!</div>
          ) : isLoading ? (
            <div>loading...</div>
          ) : null}
        </>
      </header>
    </div>
  );
}

export default App;
