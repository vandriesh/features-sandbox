import{r as _}from"./index-f1f749bf.js";import"./_commonjsHelpers-042e6b4d.js";var l={},h={get exports(){return l},set exports(e){l=e}},u={};/**
 * @license React
 * react-jsx-runtime.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var k=_,g=Symbol.for("react.element"),b=Symbol.for("react.fragment"),C=Object.prototype.hasOwnProperty,S=k.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ReactCurrentOwner,v={key:!0,ref:!0,__self:!0,__source:!0};function x(e,t,a){var r,o={},s=null,p=null;a!==void 0&&(s=""+a),t.key!==void 0&&(s=""+t.key),t.ref!==void 0&&(p=t.ref);for(r in t)C.call(t,r)&&!v.hasOwnProperty(r)&&(o[r]=t[r]);if(e&&e.defaultProps)for(r in t=e.defaultProps,t)o[r]===void 0&&(o[r]=t[r]);return{$$typeof:g,type:e,key:s,ref:p,props:o,_owner:S.current}}u.Fragment=b;u.jsx=x;u.jsxs=x;(function(e){e.exports=u})(h);const j=l.jsx,i=l.jsxs,d=({children:e,onChange:t=()=>{},defaultChecked:a,...r})=>{const o=s=>{t({target:{value:r.value,checked:s}})};return a?i("span",{...r,onClick:()=>o(!1),style:{color:"white"},children:["[x] ",e]}):i("span",{...r,onClick:()=>o(!0),style:{color:"white"},children:["[ ] ",e]})},R={component:d,title:"ASCII Design System/Freebet/Checkbox",argTypes:{defaultChecked:{options:["true","false"],control:{type:"checkbox"}}}},y=e=>j(d,{...e}),n=y.bind({});n.args={children:"a label"};const c=y.bind({});c.args={...n.args,defaultChecked:!0};var f;n.parameters={...n.parameters,storySource:{source:"args => <Checkbox {...args} />",...(f=n.parameters)==null?void 0:f.storySource}};var m;c.parameters={...c.parameters,storySource:{source:"args => <Checkbox {...args} />",...(m=c.parameters)==null?void 0:m.storySource}};const w=["Default","Checked"];export{c as Checked,n as Default,w as __namedExportsOrder,R as default};
//# sourceMappingURL=Checkbox.stories-c67794b7.js.map
