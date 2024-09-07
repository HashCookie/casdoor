import React from "react";
import {Controlled as CodeMirror} from "react-codemirror2";
import "codemirror/lib/codemirror.css";
import "codemirror/mode/properties/properties";
import * as Setting from "./Setting";
import IframeEditor from "./IframeEditor";

const CasbinEditor = ({model, useIframeEditor, onModelTextChange, onSubmit}) => {
  const submitModelEdit = React.useCallback(() => {
    if (useIframeEditor) {
      return Promise.resolve();
    } else {
      return Promise.resolve();
    }
  }, [useIframeEditor]);

  React.useEffect(() => {
    onSubmit(submitModelEdit);
  }, [onSubmit, submitModelEdit]);

  if (useIframeEditor) {
    return <IframeEditor model={model} onModelTextChange={onModelTextChange} />;
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
