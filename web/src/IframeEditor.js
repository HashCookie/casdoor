import React, {useCallback, useEffect, useRef} from "react";
import * as Setting from "./Setting";

const IframeEditor = ({model, onModelTextChange}) => {
  const iframeRef = useRef(null);

  const handleMessage = useCallback((event) => {
    if (event.origin !== "http://casbin-editor-xi.vercel.app") {
      return;
    }
    if (event.data.type === "modelUpdate") {
      if (Setting.builtInObject(model)) {
        return;
      }
      onModelTextChange(event.data.modelText);
    }
  }, [model, onModelTextChange]);

  useEffect(() => {
    window.addEventListener("message", handleMessage);
    return () => {
      window.removeEventListener("message", handleMessage);
    };
  }, [handleMessage]);

  useEffect(() => {
    const timer = setInterval(() => {
      if (iframeRef.current) {
        iframeRef.current.contentWindow.postMessage({type: "getModelText"}, "*");
      }
    }, 500);

    return () => clearInterval(timer);
  }, []);

  return (
    <iframe
      ref={iframeRef}
      src={`http://casbin-editor-xi.vercel.app/model-editor?model=${encodeURIComponent(model.modelText)}`}
      frameBorder="0"
      width="100%"
      height="500px"
      title="Casbin Model Editor"
      onLoad={() => {
        if (iframeRef.current) {
          iframeRef.current.contentWindow.postMessage({type: "getModelText"}, "*");
        }
      }}
    />
  );
};

export default IframeEditor;
