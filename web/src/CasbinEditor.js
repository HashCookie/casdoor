import React, {useCallback, useEffect, useRef} from "react";
import {Controlled as CodeMirror} from "react-codemirror2";
import "codemirror/lib/codemirror.css";
import "codemirror/mode/properties/properties";
import * as Setting from "./Setting";

const CasbinEditor = ({model, useIframeEditor, onModelTextChange, onSubmit}) => {
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

  const submitModelEdit = useCallback(() => {
    if (useIframeEditor && iframeRef.current) {
      iframeRef.current.contentWindow.postMessage({type: "getModelText"}, "*");
      return new Promise((resolve) => {
        const handleSubmitMessage = (event) => {
          if (event.data.type === "modelUpdate") {
            window.removeEventListener("message", handleSubmitMessage);
            onModelTextChange(event.data.modelText);
            resolve();
          }
        };
        window.addEventListener("message", handleSubmitMessage);
      });
    } else {
      return Promise.resolve();
    }
  }, [useIframeEditor, onModelTextChange]);

  useEffect(() => {
    onSubmit(submitModelEdit);
  }, [onSubmit, submitModelEdit]);

  if (useIframeEditor) {
    return (
      <iframe
        ref={iframeRef}
        src={`http://casbin-editor-xi.vercel.app/model-editor?model=${encodeURIComponent(model.modelText)}`}
        frameBorder="0"
        width="100%"
        height="500px"
        title="Casbin Model Editor"
      />
    );
  }

  return (
    <div style={{height: "100%", width: "100%"}}>
      <CodeMirror
        value={model.modelText}
        className="full-height-editor"
        options={{mode: "properties", theme: "default"}}
        onBeforeChange={(editor, data, value) => {
          if (Setting.builtInObject(model)) {
            return;
          }
          onModelTextChange(value);
        }}
      />
    </div>
  );
};

export default CasbinEditor;
