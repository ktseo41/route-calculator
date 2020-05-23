import React from "react";

type NotiMessageProps = {
  ["isNotiOn"]: boolean;
  ["setIsNotiOn"]: React.Dispatch<React.SetStateAction<boolean>>;
};

export default (notiMessageProps: NotiMessageProps) => {
  const { isNotiOn, setIsNotiOn } = notiMessageProps;

  return (
    <article
      style={{ position: "fixed", zIndex: 99 }}
      className={`message column is-half is-offset-one-third ${
        isNotiOn ? "" : "is-hidden"
      }`}
    >
      <div className="message-header">
        <p>Hello World</p>
        <button
          className="delete"
          aria-label="delete"
          onClick={() => setIsNotiOn(!isNotiOn)}
        ></button>
      </div>
      <div className="message-body">
        Lorem ipsum dolor sit amet, consectetur adipiscing elit.{" "}
        <strong>Pellentesque risus mi</strong>, tempus quis placerat ut, porta
        nec nulla. Vestibulum rhoncus ac ex sit amet fringilla. Nullam gravida
        purus diam, et dictum <a>felis venenatis</a> efficitur. Aenean ac{" "}
        <em>eleifend lacus</em>, in mollis lectus. Donec sodales, arcu et
        sollicitudin porttitor, tortor urna tempor ligula, id porttitor mi magna
        a neque. Donec dui urna, vehicula et sem eget, facilisis sodales sem.
      </div>
    </article>
  );
};
