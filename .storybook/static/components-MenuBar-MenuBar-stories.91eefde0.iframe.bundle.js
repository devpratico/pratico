"use strict";(self.webpackChunkpratico=self.webpackChunkpratico||[]).push([[378],{"./components/MenuBar/MenuBar.stories.ts":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.r(__webpack_exports__),__webpack_require__.d(__webpack_exports__,{MenuBar_:()=>MenuBar_,__namedExportsOrder:()=>__namedExportsOrder,default:()=>MenuBar_stories});var esm_extends=__webpack_require__("./node_modules/.pnpm/@babel+runtime@7.23.6/node_modules/@babel/runtime/helpers/esm/extends.js"),react=__webpack_require__("./node_modules/.pnpm/next@14.0.3_@babel+core@7.23.6_react-dom@18.2.0_react@18.2.0/node_modules/next/dist/compiled/react/index.js"),next_image=__webpack_require__("./node_modules/.pnpm/@storybook+nextjs@7.6.6_@swc+core@1.3.101_esbuild@0.18.20_next@14.0.3_react-dom@18.2.0_react@_ibk67ior7fmxvwilfde56n6hfe/node_modules/@storybook/nextjs/dist/images/next-image.mjs"),injectStylesIntoStyleTag=__webpack_require__("./node_modules/.pnpm/style-loader@3.3.3_webpack@5.89.0/node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js"),injectStylesIntoStyleTag_default=__webpack_require__.n(injectStylesIntoStyleTag),styleDomAPI=__webpack_require__("./node_modules/.pnpm/style-loader@3.3.3_webpack@5.89.0/node_modules/style-loader/dist/runtime/styleDomAPI.js"),styleDomAPI_default=__webpack_require__.n(styleDomAPI),insertBySelector=__webpack_require__("./node_modules/.pnpm/style-loader@3.3.3_webpack@5.89.0/node_modules/style-loader/dist/runtime/insertBySelector.js"),insertBySelector_default=__webpack_require__.n(insertBySelector),setAttributesWithoutAttributes=__webpack_require__("./node_modules/.pnpm/style-loader@3.3.3_webpack@5.89.0/node_modules/style-loader/dist/runtime/setAttributesWithoutAttributes.js"),setAttributesWithoutAttributes_default=__webpack_require__.n(setAttributesWithoutAttributes),insertStyleElement=__webpack_require__("./node_modules/.pnpm/style-loader@3.3.3_webpack@5.89.0/node_modules/style-loader/dist/runtime/insertStyleElement.js"),insertStyleElement_default=__webpack_require__.n(insertStyleElement),styleTagTransform=__webpack_require__("./node_modules/.pnpm/style-loader@3.3.3_webpack@5.89.0/node_modules/style-loader/dist/runtime/styleTagTransform.js"),styleTagTransform_default=__webpack_require__.n(styleTagTransform),Title_module=__webpack_require__("./node_modules/.pnpm/css-loader@6.8.1_webpack@5.89.0/node_modules/css-loader/dist/cjs.js??ruleSet[1].rules[8].use[1]!./node_modules/.pnpm/postcss-loader@7.3.3_postcss@8.4.32_typescript@5.3.3_webpack@5.89.0/node_modules/postcss-loader/dist/cjs.js!./components/MenuBar/Title/Title.module.css"),options={};options.styleTagTransform=styleTagTransform_default(),options.setAttributes=setAttributesWithoutAttributes_default(),options.insert=insertBySelector_default().bind(null,"head"),options.domAPI=styleDomAPI_default(),options.insertStyleElement=insertStyleElement_default();injectStylesIntoStyleTag_default()(Title_module.Z,options);const Title_Title_module=Title_module.Z&&Title_module.Z.locals?Title_module.Z.locals:void 0;var __jsx=react.createElement;function Title(_ref){var initialValue=_ref.initialValue,placeholder=_ref.placeholder,focusFirst=_ref.focusFirst,editable=_ref.editable,_useState=(0,react.useState)(initialValue),inputValue=_useState[0],setInputValue=_useState[1],inputRef=(0,react.useRef)(null),sizerRef=(0,react.useRef)(null);(0,react.useEffect)((function(){inputRef.current&&focusFirst&&editable&&inputRef.current.focus()}),[focusFirst,editable]);(0,react.useEffect)((function(){if(sizerRef.current&&inputRef.current){sizerRef.current.textContent=""===inputValue?placeholder:inputValue;var width=sizerRef.current.offsetWidth,border=inputRef.current.offsetWidth-inputRef.current.clientWidth;inputRef.current.style.width="".concat(width+border+2,"px")}}),[inputValue,placeholder]);var inputProps={type:"text",value:inputValue,onChange:function handleTitleChange(event){setInputValue(event.target.value)},placeholder,readOnly:!editable,className:"".concat(Title_Title_module.input," ").concat(Title_Title_module.textField," ").concat(editable?Title_Title_module.inputHoverable:""),ref:inputRef,disabled:!editable},spanProps={className:"".concat(Title_Title_module.sizer," ").concat(Title_Title_module.textField),ref:sizerRef};return __jsx("div",{className:Title_Title_module.wrapper},__jsx("input",inputProps),__jsx("span",spanProps))}Title.displayName="Title";try{Title.displayName="Title",Title.__docgenInfo={description:"This component is a text field that automatically resizes to fit its content.\nIt uses a hidden `span` element to measure the width of the text.",displayName:"Title",props:{initialValue:{defaultValue:null,description:"",name:"initialValue",required:!0,type:{name:"string"}},placeholder:{defaultValue:null,description:"",name:"placeholder",required:!0,type:{name:"string"}},focusFirst:{defaultValue:null,description:"If true, the input will be focused when the component is mounted.",name:"focusFirst",required:!0,type:{name:"boolean"}},editable:{defaultValue:null,description:"If true, the input will be editable.",name:"editable",required:!0,type:{name:"boolean"}}}},"undefined"!=typeof STORYBOOK_REACT_CLASSES&&(STORYBOOK_REACT_CLASSES["components/MenuBar/Title/Title.tsx#Title"]={docgenInfo:Title.__docgenInfo,name:"Title",path:"components/MenuBar/Title/Title.tsx#Title"})}catch(__react_docgen_typescript_loader_error){}var LabeledIconBtn=__webpack_require__("./components/Primitives/Buttons/LabaledIconBtn/LabeledIconBtn.tsx"),MenuBarLayout_module=__webpack_require__("./node_modules/.pnpm/css-loader@6.8.1_webpack@5.89.0/node_modules/css-loader/dist/cjs.js??ruleSet[1].rules[8].use[1]!./node_modules/.pnpm/postcss-loader@7.3.3_postcss@8.4.32_typescript@5.3.3_webpack@5.89.0/node_modules/postcss-loader/dist/cjs.js!./components/MenuBar/MenuBarLayout/MenuBarLayout.module.css"),MenuBarLayout_module_options={};MenuBarLayout_module_options.styleTagTransform=styleTagTransform_default(),MenuBarLayout_module_options.setAttributes=setAttributesWithoutAttributes_default(),MenuBarLayout_module_options.insert=insertBySelector_default().bind(null,"head"),MenuBarLayout_module_options.domAPI=styleDomAPI_default(),MenuBarLayout_module_options.insertStyleElement=insertStyleElement_default();injectStylesIntoStyleTag_default()(MenuBarLayout_module.Z,MenuBarLayout_module_options);const MenuBarLayout_MenuBarLayout_module=MenuBarLayout_module.Z&&MenuBarLayout_module.Z.locals?MenuBarLayout_module.Z.locals:void 0;var MenuBarLayout_jsx=react.createElement;function MenuBarLayout(_ref){var children=_ref.children,spacerPosition=_ref.spacerPosition,styledChildren=(Array.isArray(children)?children:[children]).map((function(child,index){return MenuBarLayout_jsx("div",{className:MenuBarLayout_MenuBarLayout_module.child,key:index},child)})),spacer=MenuBarLayout_jsx("div",{className:MenuBarLayout_MenuBarLayout_module.spacer,key:"spacer"});spacerPosition&&styledChildren.splice(spacerPosition,0,spacer);var containerStyle=spacerPosition?MenuBarLayout_MenuBarLayout_module.container:MenuBarLayout_MenuBarLayout_module.container+" "+MenuBarLayout_MenuBarLayout_module.spaceBetween;return MenuBarLayout_jsx("nav",{className:containerStyle},styledChildren)}MenuBarLayout.displayName="MenuBarLayout";try{MenuBarLayout.displayName="MenuBarLayout",MenuBarLayout.__docgenInfo={description:"Renders a menu bar layout to which components can be added as children.",displayName:"MenuBarLayout",props:{spacerPosition:{defaultValue:null,description:"",name:"spacerPosition",required:!1,type:{name:"number"}}}},"undefined"!=typeof STORYBOOK_REACT_CLASSES&&(STORYBOOK_REACT_CLASSES["components/MenuBar/MenuBarLayout/MenuBarLayout.tsx#MenuBarLayout"]={docgenInfo:MenuBarLayout.__docgenInfo,name:"MenuBarLayout",path:"components/MenuBar/MenuBarLayout/MenuBarLayout.tsx#MenuBarLayout"})}catch(__react_docgen_typescript_loader_error){}const pratico={src:"static/media/pratico.15c1c5d2.svg",height:224,width:822,blurDataURL:"static/media/pratico.15c1c5d2.svg"};var MenuBar_jsx=react.createElement;function MenuBar(_ref){var mode=_ref.mode,styleBtnProps={iconColor:"var(--text-on-primary)",size:"sm",labelColor:"var(--secondary)",hideLabel:_ref.hideLabels,centered:!0};switch(mode){case"creation":return MenuBar_jsx(MenuBarLayout,{spacerPosition:3},MenuBar_jsx(next_image.Z,{src:pratico,width:100,height:50,alt:"Pratico"}),MenuBar_jsx(Title,{initialValue:"",placeholder:"Session name",focusFirst:!0,editable:!0}),MenuBar_jsx(LabeledIconBtn.Z,(0,esm_extends.Z)({type:"play",label:"play"},styleBtnProps)),MenuBar_jsx(LabeledIconBtn.Z,(0,esm_extends.Z)({type:"puzzle",label:"polls"},styleBtnProps)),MenuBar_jsx(LabeledIconBtn.Z,(0,esm_extends.Z)({type:"ellipsis",label:"more"},styleBtnProps)));case"animation":return MenuBar_jsx(MenuBarLayout,{spacerPosition:4},MenuBar_jsx(next_image.Z,{src:pratico,width:100,height:50,alt:"Pratico"}),MenuBar_jsx(Title,{initialValue:"My session",placeholder:"Session name",focusFirst:!1,editable:!1}),MenuBar_jsx(LabeledIconBtn.Z,(0,esm_extends.Z)({type:"pause",label:"pause"},styleBtnProps)),MenuBar_jsx(LabeledIconBtn.Z,(0,esm_extends.Z)({type:"stop",label:"stop"},styleBtnProps)),MenuBar_jsx(LabeledIconBtn.Z,(0,esm_extends.Z)({type:"stopwatch",label:"stopwatch"},styleBtnProps)),MenuBar_jsx(LabeledIconBtn.Z,(0,esm_extends.Z)({type:"chat",label:"chat"},styleBtnProps)),MenuBar_jsx(LabeledIconBtn.Z,(0,esm_extends.Z)({type:"users",label:"students"},styleBtnProps)),MenuBar_jsx(LabeledIconBtn.Z,(0,esm_extends.Z)({type:"ellipsis",label:"more"},styleBtnProps)));case"dashboard":return MenuBar_jsx(MenuBarLayout,{spacerPosition:1},MenuBar_jsx(next_image.Z,{src:pratico,width:100,height:50,alt:"Pratico"}))}}try{MenuBar.displayName="MenuBar",MenuBar.__docgenInfo={description:"This component uses the `MenuBarLayout` component to render a menu bar with the appropriate buttons for the specified mode.",displayName:"MenuBar",props:{mode:{defaultValue:null,description:"",name:"mode",required:!0,type:{name:"enum",value:[{value:'"creation"'},{value:'"animation"'},{value:'"dashboard"'}]}},hideLabels:{defaultValue:null,description:"",name:"hideLabels",required:!1,type:{name:"boolean"}}}},"undefined"!=typeof STORYBOOK_REACT_CLASSES&&(STORYBOOK_REACT_CLASSES["components/MenuBar/MenuBar.tsx#MenuBar"]={docgenInfo:MenuBar.__docgenInfo,name:"MenuBar",path:"components/MenuBar/MenuBar.tsx#MenuBar"})}catch(__react_docgen_typescript_loader_error){}const MenuBar_stories={title:"Composants",component:MenuBar};var MenuBar_={args:{mode:"creation"}};MenuBar_.parameters={...MenuBar_.parameters,docs:{...MenuBar_.parameters?.docs,source:{originalSource:"{\n  args: {\n    mode: 'creation'\n  }\n}",...MenuBar_.parameters?.docs?.source}}};const __namedExportsOrder=["MenuBar_"]},"./components/Primitives/Buttons/LabaledIconBtn/LabeledIconBtn.tsx":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.d(__webpack_exports__,{Z:()=>LabeledIconBtn});var objectWithoutProperties=__webpack_require__("./node_modules/.pnpm/@babel+runtime@7.23.6/node_modules/@babel/runtime/helpers/esm/objectWithoutProperties.js"),react=__webpack_require__("./node_modules/.pnpm/next@14.0.3_@babel+core@7.23.6_react-dom@18.2.0_react@18.2.0/node_modules/next/dist/compiled/react/index.js"),injectStylesIntoStyleTag=__webpack_require__("./node_modules/.pnpm/style-loader@3.3.3_webpack@5.89.0/node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js"),injectStylesIntoStyleTag_default=__webpack_require__.n(injectStylesIntoStyleTag),styleDomAPI=__webpack_require__("./node_modules/.pnpm/style-loader@3.3.3_webpack@5.89.0/node_modules/style-loader/dist/runtime/styleDomAPI.js"),styleDomAPI_default=__webpack_require__.n(styleDomAPI),insertBySelector=__webpack_require__("./node_modules/.pnpm/style-loader@3.3.3_webpack@5.89.0/node_modules/style-loader/dist/runtime/insertBySelector.js"),insertBySelector_default=__webpack_require__.n(insertBySelector),setAttributesWithoutAttributes=__webpack_require__("./node_modules/.pnpm/style-loader@3.3.3_webpack@5.89.0/node_modules/style-loader/dist/runtime/setAttributesWithoutAttributes.js"),setAttributesWithoutAttributes_default=__webpack_require__.n(setAttributesWithoutAttributes),insertStyleElement=__webpack_require__("./node_modules/.pnpm/style-loader@3.3.3_webpack@5.89.0/node_modules/style-loader/dist/runtime/insertStyleElement.js"),insertStyleElement_default=__webpack_require__.n(insertStyleElement),styleTagTransform=__webpack_require__("./node_modules/.pnpm/style-loader@3.3.3_webpack@5.89.0/node_modules/style-loader/dist/runtime/styleTagTransform.js"),styleTagTransform_default=__webpack_require__.n(styleTagTransform),LabeledIconBtn_module=__webpack_require__("./node_modules/.pnpm/css-loader@6.8.1_webpack@5.89.0/node_modules/css-loader/dist/cjs.js??ruleSet[1].rules[8].use[1]!./node_modules/.pnpm/postcss-loader@7.3.3_postcss@8.4.32_typescript@5.3.3_webpack@5.89.0/node_modules/postcss-loader/dist/cjs.js!./components/Primitives/Buttons/LabaledIconBtn/LabeledIconBtn.module.css"),options={};options.styleTagTransform=styleTagTransform_default(),options.setAttributes=setAttributesWithoutAttributes_default(),options.insert=insertBySelector_default().bind(null,"head"),options.domAPI=styleDomAPI_default(),options.insertStyleElement=insertStyleElement_default();injectStylesIntoStyleTag_default()(LabeledIconBtn_module.Z,options);const LabaledIconBtn_LabeledIconBtn_module=LabeledIconBtn_module.Z&&LabeledIconBtn_module.Z.locals?LabeledIconBtn_module.Z.locals:void 0;var LabeledIcon=__webpack_require__("./components/Primitives/LabeledIcon/LabeledIcon.tsx"),_excluded=["onClick"],__jsx=react.createElement;function LabeledIconBtn(_ref){var onClick=_ref.onClick,labeledIconProps=(0,objectWithoutProperties.Z)(_ref,_excluded);return __jsx("button",{className:LabaledIconBtn_LabeledIconBtn_module.btn,onClick},__jsx(LabeledIcon.Z,labeledIconProps))}LabeledIconBtn.displayName="LabeledIconBtn";try{LabeledIconBtn.displayName="LabeledIconBtn",LabeledIconBtn.__docgenInfo={description:"",displayName:"LabeledIconBtn",props:{onClick:{defaultValue:null,description:"",name:"onClick",required:!1,type:{name:"(() => void)"}},type:{defaultValue:null,description:"",name:"type",required:!0,type:{name:"enum",value:[{value:'"play"'},{value:'"stopwatch"'},{value:'"puzzle"'},{value:'"chat"'},{value:'"users"'},{value:'"ellipsis"'},{value:'"pause"'},{value:'"stop"'},{value:'"square-plus"'},{value:'"expand"'},{value:'"chevron-left"'},{value:'"chevron-right"'},{value:'"file"'},{value:'"clock-rotate-left"'},{value:'"book"'},{value:'"circle-question"'},{value:'"gear"'},{value:'"file-lines"'},{value:'"grip"'},{value:'"list"'}]}},label:{defaultValue:null,description:"",name:"label",required:!1,type:{name:"string"}},hideLabel:{defaultValue:null,description:"",name:"hideLabel",required:!1,type:{name:"boolean"}},iconColor:{defaultValue:null,description:"",name:"iconColor",required:!1,type:{name:"string"}},labelColor:{defaultValue:null,description:"",name:"labelColor",required:!1,type:{name:"string"}},size:{defaultValue:null,description:"",name:"size",required:!1,type:{name:"enum",value:[{value:'"2xs"'},{value:'"xs"'},{value:'"sm"'},{value:'"lg"'},{value:'"xl"'}]}},centered:{defaultValue:null,description:"If true, the center of the element will be set to the center of the icon.",name:"centered",required:!1,type:{name:"boolean"}}}},"undefined"!=typeof STORYBOOK_REACT_CLASSES&&(STORYBOOK_REACT_CLASSES["components/Primitives/Buttons/LabaledIconBtn/LabeledIconBtn.tsx#LabeledIconBtn"]={docgenInfo:LabeledIconBtn.__docgenInfo,name:"LabeledIconBtn",path:"components/Primitives/Buttons/LabaledIconBtn/LabeledIconBtn.tsx#LabeledIconBtn"})}catch(__react_docgen_typescript_loader_error){}},"./components/Primitives/LabeledIcon/LabeledIcon.tsx":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.d(__webpack_exports__,{Z:()=>LabeledIcon});var react=__webpack_require__("./node_modules/.pnpm/next@14.0.3_@babel+core@7.23.6_react-dom@18.2.0_react@18.2.0/node_modules/next/dist/compiled/react/index.js"),injectStylesIntoStyleTag=__webpack_require__("./node_modules/.pnpm/style-loader@3.3.3_webpack@5.89.0/node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js"),injectStylesIntoStyleTag_default=__webpack_require__.n(injectStylesIntoStyleTag),styleDomAPI=__webpack_require__("./node_modules/.pnpm/style-loader@3.3.3_webpack@5.89.0/node_modules/style-loader/dist/runtime/styleDomAPI.js"),styleDomAPI_default=__webpack_require__.n(styleDomAPI),insertBySelector=__webpack_require__("./node_modules/.pnpm/style-loader@3.3.3_webpack@5.89.0/node_modules/style-loader/dist/runtime/insertBySelector.js"),insertBySelector_default=__webpack_require__.n(insertBySelector),setAttributesWithoutAttributes=__webpack_require__("./node_modules/.pnpm/style-loader@3.3.3_webpack@5.89.0/node_modules/style-loader/dist/runtime/setAttributesWithoutAttributes.js"),setAttributesWithoutAttributes_default=__webpack_require__.n(setAttributesWithoutAttributes),insertStyleElement=__webpack_require__("./node_modules/.pnpm/style-loader@3.3.3_webpack@5.89.0/node_modules/style-loader/dist/runtime/insertStyleElement.js"),insertStyleElement_default=__webpack_require__.n(insertStyleElement),styleTagTransform=__webpack_require__("./node_modules/.pnpm/style-loader@3.3.3_webpack@5.89.0/node_modules/style-loader/dist/runtime/styleTagTransform.js"),styleTagTransform_default=__webpack_require__.n(styleTagTransform),LabeledIcon_module=__webpack_require__("./node_modules/.pnpm/css-loader@6.8.1_webpack@5.89.0/node_modules/css-loader/dist/cjs.js??ruleSet[1].rules[8].use[1]!./node_modules/.pnpm/postcss-loader@7.3.3_postcss@8.4.32_typescript@5.3.3_webpack@5.89.0/node_modules/postcss-loader/dist/cjs.js!./components/Primitives/LabeledIcon/LabeledIcon.module.css"),options={};options.styleTagTransform=styleTagTransform_default(),options.setAttributes=setAttributesWithoutAttributes_default(),options.insert=insertBySelector_default().bind(null,"head"),options.domAPI=styleDomAPI_default(),options.insertStyleElement=insertStyleElement_default();injectStylesIntoStyleTag_default()(LabeledIcon_module.Z,options);const LabeledIcon_LabeledIcon_module=LabeledIcon_module.Z&&LabeledIcon_module.Z.locals?LabeledIcon_module.Z.locals:void 0;var Icons=__webpack_require__("./utils/Icons.tsx"),__jsx=react.createElement;function LabeledIcon(_ref){var type=_ref.type,label=_ref.label,hideLabel=_ref.hideLabel,iconColor=_ref.iconColor,labelColor=_ref.labelColor,size=_ref.size,centered=_ref.centered,icon=(0,Icons.q)(type);return size&&(icon=react.cloneElement(icon,{size})),__jsx("div",{className:LabeledIcon_LabeledIcon_module.container},label&&1!=hideLabel&&centered?__jsx("p",{className:"".concat(LabeledIcon_LabeledIcon_module.label," ").concat(LabeledIcon_LabeledIcon_module.invisible)},label):null,__jsx("div",{style:{color:iconColor}},icon),label&&1!=hideLabel?__jsx("p",{className:LabeledIcon_LabeledIcon_module.label,style:{color:labelColor}},label):null)}LabeledIcon.displayName="LabeledIcon";try{LabeledIcon.displayName="LabeledIcon",LabeledIcon.__docgenInfo={description:"",displayName:"LabeledIcon",props:{type:{defaultValue:null,description:"",name:"type",required:!0,type:{name:"enum",value:[{value:'"play"'},{value:'"stopwatch"'},{value:'"puzzle"'},{value:'"chat"'},{value:'"users"'},{value:'"ellipsis"'},{value:'"pause"'},{value:'"stop"'},{value:'"square-plus"'},{value:'"expand"'},{value:'"chevron-left"'},{value:'"chevron-right"'},{value:'"file"'},{value:'"clock-rotate-left"'},{value:'"book"'},{value:'"circle-question"'},{value:'"gear"'},{value:'"file-lines"'},{value:'"grip"'},{value:'"list"'}]}},label:{defaultValue:null,description:"",name:"label",required:!1,type:{name:"string"}},hideLabel:{defaultValue:null,description:"",name:"hideLabel",required:!1,type:{name:"boolean"}},iconColor:{defaultValue:null,description:"",name:"iconColor",required:!1,type:{name:"string"}},labelColor:{defaultValue:null,description:"",name:"labelColor",required:!1,type:{name:"string"}},size:{defaultValue:null,description:"",name:"size",required:!1,type:{name:"enum",value:[{value:'"2xs"'},{value:'"xs"'},{value:'"sm"'},{value:'"lg"'},{value:'"xl"'}]}},centered:{defaultValue:null,description:"If true, the center of the element will be set to the center of the icon.",name:"centered",required:!1,type:{name:"boolean"}}}},"undefined"!=typeof STORYBOOK_REACT_CLASSES&&(STORYBOOK_REACT_CLASSES["components/Primitives/LabeledIcon/LabeledIcon.tsx#LabeledIcon"]={docgenInfo:LabeledIcon.__docgenInfo,name:"LabeledIcon",path:"components/Primitives/LabeledIcon/LabeledIcon.tsx#LabeledIcon"})}catch(__react_docgen_typescript_loader_error){}},"./utils/Icons.tsx":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.d(__webpack_exports__,{q:()=>getIcon});var react__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__("./node_modules/.pnpm/next@14.0.3_@babel+core@7.23.6_react-dom@18.2.0_react@18.2.0/node_modules/next/dist/compiled/react/index.js"),_fortawesome_react_fontawesome__WEBPACK_IMPORTED_MODULE_1__=__webpack_require__("./node_modules/.pnpm/@fortawesome+react-fontawesome@0.2.0_@fortawesome+fontawesome-svg-core@6.5.1_react@18.2.0/node_modules/@fortawesome/react-fontawesome/index.es.js"),_fortawesome_free_solid_svg_icons__WEBPACK_IMPORTED_MODULE_3__=(__webpack_require__("./node_modules/.pnpm/@fortawesome+fontawesome-svg-core@6.5.1/node_modules/@fortawesome/fontawesome-svg-core/styles.css"),__webpack_require__("./node_modules/.pnpm/@fortawesome+free-solid-svg-icons@6.5.1/node_modules/@fortawesome/free-solid-svg-icons/index.mjs")),__jsx=react__WEBPACK_IMPORTED_MODULE_0__.createElement,iconsMap={stopwatch:__jsx(_fortawesome_react_fontawesome__WEBPACK_IMPORTED_MODULE_1__.G,{icon:_fortawesome_free_solid_svg_icons__WEBPACK_IMPORTED_MODULE_3__.U$5}),puzzle:__jsx(_fortawesome_react_fontawesome__WEBPACK_IMPORTED_MODULE_1__.G,{icon:_fortawesome_free_solid_svg_icons__WEBPACK_IMPORTED_MODULE_3__.NxF}),chat:__jsx(_fortawesome_react_fontawesome__WEBPACK_IMPORTED_MODULE_1__.G,{icon:_fortawesome_free_solid_svg_icons__WEBPACK_IMPORTED_MODULE_3__.vto}),users:__jsx(_fortawesome_react_fontawesome__WEBPACK_IMPORTED_MODULE_1__.G,{icon:_fortawesome_free_solid_svg_icons__WEBPACK_IMPORTED_MODULE_3__.FVb}),ellipsis:__jsx(_fortawesome_react_fontawesome__WEBPACK_IMPORTED_MODULE_1__.G,{icon:_fortawesome_free_solid_svg_icons__WEBPACK_IMPORTED_MODULE_3__.S6C}),play:__jsx(_fortawesome_react_fontawesome__WEBPACK_IMPORTED_MODULE_1__.G,{icon:_fortawesome_free_solid_svg_icons__WEBPACK_IMPORTED_MODULE_3__.zc}),pause:__jsx(_fortawesome_react_fontawesome__WEBPACK_IMPORTED_MODULE_1__.G,{icon:_fortawesome_free_solid_svg_icons__WEBPACK_IMPORTED_MODULE_3__.XQY}),stop:__jsx(_fortawesome_react_fontawesome__WEBPACK_IMPORTED_MODULE_1__.G,{icon:_fortawesome_free_solid_svg_icons__WEBPACK_IMPORTED_MODULE_3__.Bg$}),"square-plus":__jsx(_fortawesome_react_fontawesome__WEBPACK_IMPORTED_MODULE_1__.G,{icon:_fortawesome_free_solid_svg_icons__WEBPACK_IMPORTED_MODULE_3__.g6h}),expand:__jsx(_fortawesome_react_fontawesome__WEBPACK_IMPORTED_MODULE_1__.G,{icon:_fortawesome_free_solid_svg_icons__WEBPACK_IMPORTED_MODULE_3__.TL5}),"chevron-left":__jsx(_fortawesome_react_fontawesome__WEBPACK_IMPORTED_MODULE_1__.G,{icon:_fortawesome_free_solid_svg_icons__WEBPACK_IMPORTED_MODULE_3__.A35}),"chevron-right":__jsx(_fortawesome_react_fontawesome__WEBPACK_IMPORTED_MODULE_1__.G,{icon:_fortawesome_free_solid_svg_icons__WEBPACK_IMPORTED_MODULE_3__._tD}),file:__jsx(_fortawesome_react_fontawesome__WEBPACK_IMPORTED_MODULE_1__.G,{icon:_fortawesome_free_solid_svg_icons__WEBPACK_IMPORTED_MODULE_3__.gMD}),"clock-rotate-left":__jsx(_fortawesome_react_fontawesome__WEBPACK_IMPORTED_MODULE_1__.G,{icon:_fortawesome_free_solid_svg_icons__WEBPACK_IMPORTED_MODULE_3__.On6}),book:__jsx(_fortawesome_react_fontawesome__WEBPACK_IMPORTED_MODULE_1__.G,{icon:_fortawesome_free_solid_svg_icons__WEBPACK_IMPORTED_MODULE_3__.FL8}),"circle-question":__jsx(_fortawesome_react_fontawesome__WEBPACK_IMPORTED_MODULE_1__.G,{icon:_fortawesome_free_solid_svg_icons__WEBPACK_IMPORTED_MODULE_3__.FDd}),gear:__jsx(_fortawesome_react_fontawesome__WEBPACK_IMPORTED_MODULE_1__.G,{icon:_fortawesome_free_solid_svg_icons__WEBPACK_IMPORTED_MODULE_3__.gr5}),"file-lines":__jsx(_fortawesome_react_fontawesome__WEBPACK_IMPORTED_MODULE_1__.G,{icon:_fortawesome_free_solid_svg_icons__WEBPACK_IMPORTED_MODULE_3__.nfZ}),grip:__jsx(_fortawesome_react_fontawesome__WEBPACK_IMPORTED_MODULE_1__.G,{icon:_fortawesome_free_solid_svg_icons__WEBPACK_IMPORTED_MODULE_3__.QR4}),list:__jsx(_fortawesome_react_fontawesome__WEBPACK_IMPORTED_MODULE_1__.G,{icon:_fortawesome_free_solid_svg_icons__WEBPACK_IMPORTED_MODULE_3__.Zrf})};function getIcon(type,size){var icon=iconsMap[type];return size&&(icon=react__WEBPACK_IMPORTED_MODULE_0__.cloneElement(icon,{size})),icon}},"./node_modules/.pnpm/css-loader@6.8.1_webpack@5.89.0/node_modules/css-loader/dist/cjs.js??ruleSet[1].rules[8].use[1]!./node_modules/.pnpm/postcss-loader@7.3.3_postcss@8.4.32_typescript@5.3.3_webpack@5.89.0/node_modules/postcss-loader/dist/cjs.js!./components/MenuBar/MenuBarLayout/MenuBarLayout.module.css":(module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.d(__webpack_exports__,{Z:()=>__WEBPACK_DEFAULT_EXPORT__});var _node_modules_pnpm_css_loader_6_8_1_webpack_5_89_0_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__("./node_modules/.pnpm/css-loader@6.8.1_webpack@5.89.0/node_modules/css-loader/dist/runtime/sourceMaps.js"),_node_modules_pnpm_css_loader_6_8_1_webpack_5_89_0_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default=__webpack_require__.n(_node_modules_pnpm_css_loader_6_8_1_webpack_5_89_0_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0__),_node_modules_pnpm_css_loader_6_8_1_webpack_5_89_0_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__=__webpack_require__("./node_modules/.pnpm/css-loader@6.8.1_webpack@5.89.0/node_modules/css-loader/dist/runtime/api.js"),___CSS_LOADER_EXPORT___=__webpack_require__.n(_node_modules_pnpm_css_loader_6_8_1_webpack_5_89_0_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__)()(_node_modules_pnpm_css_loader_6_8_1_webpack_5_89_0_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default());___CSS_LOADER_EXPORT___.push([module.id,".MenuBarLayout_container___YLuz {\n    --mbl-padding: 0.7rem;\n    background-color: var(--brand);\n    border-bottom: 1px solid var(--brand-border);\n    height: 50px;\n    display: flex;\n    align-items: center;\n    padding: 0 calc(var(--mbl-padding)/2);\n    overflow: hidden;\n}\n\n.MenuBarLayout_spaceBetween__eK4Yq {\n    justify-content: space-between;\n}\n\n.MenuBarLayout_child__SpLCt {\n    padding: 0 calc(var(--mbl-padding)/2);\n    display: flex;\n}\n\n.MenuBarLayout_spacer__dGWlT {\n    flex-grow: 1;\n}\n","",{version:3,sources:["webpack://./components/MenuBar/MenuBarLayout/MenuBarLayout.module.css"],names:[],mappings:"AAAA;IACI,qBAAqB;IACrB,8BAA8B;IAC9B,4CAA4C;IAC5C,YAAY;IACZ,aAAa;IACb,mBAAmB;IACnB,qCAAqC;IACrC,gBAAgB;AACpB;;AAEA;IACI,8BAA8B;AAClC;;AAEA;IACI,qCAAqC;IACrC,aAAa;AACjB;;AAEA;IACI,YAAY;AAChB",sourcesContent:[".container {\n    --mbl-padding: 0.7rem;\n    background-color: var(--brand);\n    border-bottom: 1px solid var(--brand-border);\n    height: 50px;\n    display: flex;\n    align-items: center;\n    padding: 0 calc(var(--mbl-padding)/2);\n    overflow: hidden;\n}\n\n.spaceBetween {\n    justify-content: space-between;\n}\n\n.child {\n    padding: 0 calc(var(--mbl-padding)/2);\n    display: flex;\n}\n\n.spacer {\n    flex-grow: 1;\n}\n"],sourceRoot:""}]),___CSS_LOADER_EXPORT___.locals={container:"MenuBarLayout_container___YLuz",spaceBetween:"MenuBarLayout_spaceBetween__eK4Yq",child:"MenuBarLayout_child__SpLCt",spacer:"MenuBarLayout_spacer__dGWlT"};const __WEBPACK_DEFAULT_EXPORT__=___CSS_LOADER_EXPORT___},"./node_modules/.pnpm/css-loader@6.8.1_webpack@5.89.0/node_modules/css-loader/dist/cjs.js??ruleSet[1].rules[8].use[1]!./node_modules/.pnpm/postcss-loader@7.3.3_postcss@8.4.32_typescript@5.3.3_webpack@5.89.0/node_modules/postcss-loader/dist/cjs.js!./components/MenuBar/Title/Title.module.css":(module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.d(__webpack_exports__,{Z:()=>__WEBPACK_DEFAULT_EXPORT__});var _node_modules_pnpm_css_loader_6_8_1_webpack_5_89_0_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__("./node_modules/.pnpm/css-loader@6.8.1_webpack@5.89.0/node_modules/css-loader/dist/runtime/sourceMaps.js"),_node_modules_pnpm_css_loader_6_8_1_webpack_5_89_0_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default=__webpack_require__.n(_node_modules_pnpm_css_loader_6_8_1_webpack_5_89_0_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0__),_node_modules_pnpm_css_loader_6_8_1_webpack_5_89_0_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__=__webpack_require__("./node_modules/.pnpm/css-loader@6.8.1_webpack@5.89.0/node_modules/css-loader/dist/runtime/api.js"),___CSS_LOADER_EXPORT___=__webpack_require__.n(_node_modules_pnpm_css_loader_6_8_1_webpack_5_89_0_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__)()(_node_modules_pnpm_css_loader_6_8_1_webpack_5_89_0_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default());___CSS_LOADER_EXPORT___.push([module.id,".Title_textField__7autr {\n    font-size: 0.9rem;\n    border-radius: 7px;\n    padding: 8px 10px;\n    height: 100%;\n    border: none;\n    box-sizing: border-box;\n}\n\n.Title_input__V97HQ {\n    color: white;\n    background-color: transparent;\n    caret-color: white;\n}\n\n\n.Title_inputHoverable___ZlIZ:hover {\n    background-color: var(--violet-light);\n}\n\n\n.Title_inputHoverable___ZlIZ:focus {\n    outline: none;\n    background-color: var(--violet-light);\n}\n\n.Title_inputHoverable___ZlIZ:active {\n    outline: none;\n    background-color: var(--violet-light);\n}\n\n.Title_input__V97HQ::placeholder {\n    color: rgba(255, 255, 255, 0.5);\n}\n\n.Title_wrapper__e2jKQ {\n    position: relative;\n}\n\n.Title_sizer__PvrS0 {\n    position: absolute;\n    visibility: hidden;\n    overflow: hidden;\n    white-space: pre; /* Ensures spaces are preserved */\n}","",{version:3,sources:["webpack://./components/MenuBar/Title/Title.module.css"],names:[],mappings:"AAAA;IACI,iBAAiB;IACjB,kBAAkB;IAClB,iBAAiB;IACjB,YAAY;IACZ,YAAY;IACZ,sBAAsB;AAC1B;;AAEA;IACI,YAAY;IACZ,6BAA6B;IAC7B,kBAAkB;AACtB;;;AAGA;IACI,qCAAqC;AACzC;;;AAGA;IACI,aAAa;IACb,qCAAqC;AACzC;;AAEA;IACI,aAAa;IACb,qCAAqC;AACzC;;AAEA;IACI,+BAA+B;AACnC;;AAEA;IACI,kBAAkB;AACtB;;AAEA;IACI,kBAAkB;IAClB,kBAAkB;IAClB,gBAAgB;IAChB,gBAAgB,EAAE,iCAAiC;AACvD",sourcesContent:[".textField {\n    font-size: 0.9rem;\n    border-radius: 7px;\n    padding: 8px 10px;\n    height: 100%;\n    border: none;\n    box-sizing: border-box;\n}\n\n.input {\n    color: white;\n    background-color: transparent;\n    caret-color: white;\n}\n\n\n.inputHoverable:hover {\n    background-color: var(--violet-light);\n}\n\n\n.inputHoverable:focus {\n    outline: none;\n    background-color: var(--violet-light);\n}\n\n.inputHoverable:active {\n    outline: none;\n    background-color: var(--violet-light);\n}\n\n.input::placeholder {\n    color: rgba(255, 255, 255, 0.5);\n}\n\n.wrapper {\n    position: relative;\n}\n\n.sizer {\n    position: absolute;\n    visibility: hidden;\n    overflow: hidden;\n    white-space: pre; /* Ensures spaces are preserved */\n}"],sourceRoot:""}]),___CSS_LOADER_EXPORT___.locals={textField:"Title_textField__7autr",input:"Title_input__V97HQ",inputHoverable:"Title_inputHoverable___ZlIZ",wrapper:"Title_wrapper__e2jKQ",sizer:"Title_sizer__PvrS0"};const __WEBPACK_DEFAULT_EXPORT__=___CSS_LOADER_EXPORT___},"./node_modules/.pnpm/css-loader@6.8.1_webpack@5.89.0/node_modules/css-loader/dist/cjs.js??ruleSet[1].rules[8].use[1]!./node_modules/.pnpm/postcss-loader@7.3.3_postcss@8.4.32_typescript@5.3.3_webpack@5.89.0/node_modules/postcss-loader/dist/cjs.js!./components/Primitives/Buttons/LabaledIconBtn/LabeledIconBtn.module.css":(module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.d(__webpack_exports__,{Z:()=>__WEBPACK_DEFAULT_EXPORT__});var _node_modules_pnpm_css_loader_6_8_1_webpack_5_89_0_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__("./node_modules/.pnpm/css-loader@6.8.1_webpack@5.89.0/node_modules/css-loader/dist/runtime/sourceMaps.js"),_node_modules_pnpm_css_loader_6_8_1_webpack_5_89_0_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default=__webpack_require__.n(_node_modules_pnpm_css_loader_6_8_1_webpack_5_89_0_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0__),_node_modules_pnpm_css_loader_6_8_1_webpack_5_89_0_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__=__webpack_require__("./node_modules/.pnpm/css-loader@6.8.1_webpack@5.89.0/node_modules/css-loader/dist/runtime/api.js"),___CSS_LOADER_EXPORT___=__webpack_require__.n(_node_modules_pnpm_css_loader_6_8_1_webpack_5_89_0_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__)()(_node_modules_pnpm_css_loader_6_8_1_webpack_5_89_0_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default());___CSS_LOADER_EXPORT___.push([module.id,".LabeledIconBtn_btn__cAzTl {\n    background-color: transparent;\n    border: none;\n    cursor: pointer;\n    outline: none;\n    padding: 0;\n    margin: 0;\n    font-size: inherit;\n}","",{version:3,sources:["webpack://./components/Primitives/Buttons/LabaledIconBtn/LabeledIconBtn.module.css"],names:[],mappings:"AAAA;IACI,6BAA6B;IAC7B,YAAY;IACZ,eAAe;IACf,aAAa;IACb,UAAU;IACV,SAAS;IACT,kBAAkB;AACtB",sourcesContent:[".btn {\n    background-color: transparent;\n    border: none;\n    cursor: pointer;\n    outline: none;\n    padding: 0;\n    margin: 0;\n    font-size: inherit;\n}"],sourceRoot:""}]),___CSS_LOADER_EXPORT___.locals={btn:"LabeledIconBtn_btn__cAzTl"};const __WEBPACK_DEFAULT_EXPORT__=___CSS_LOADER_EXPORT___},"./node_modules/.pnpm/css-loader@6.8.1_webpack@5.89.0/node_modules/css-loader/dist/cjs.js??ruleSet[1].rules[8].use[1]!./node_modules/.pnpm/postcss-loader@7.3.3_postcss@8.4.32_typescript@5.3.3_webpack@5.89.0/node_modules/postcss-loader/dist/cjs.js!./components/Primitives/LabeledIcon/LabeledIcon.module.css":(module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.d(__webpack_exports__,{Z:()=>__WEBPACK_DEFAULT_EXPORT__});var _node_modules_pnpm_css_loader_6_8_1_webpack_5_89_0_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__("./node_modules/.pnpm/css-loader@6.8.1_webpack@5.89.0/node_modules/css-loader/dist/runtime/sourceMaps.js"),_node_modules_pnpm_css_loader_6_8_1_webpack_5_89_0_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default=__webpack_require__.n(_node_modules_pnpm_css_loader_6_8_1_webpack_5_89_0_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0__),_node_modules_pnpm_css_loader_6_8_1_webpack_5_89_0_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__=__webpack_require__("./node_modules/.pnpm/css-loader@6.8.1_webpack@5.89.0/node_modules/css-loader/dist/runtime/api.js"),___CSS_LOADER_EXPORT___=__webpack_require__.n(_node_modules_pnpm_css_loader_6_8_1_webpack_5_89_0_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__)()(_node_modules_pnpm_css_loader_6_8_1_webpack_5_89_0_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default());___CSS_LOADER_EXPORT___.push([module.id,".LabeledIcon_container__M0F6q {\n    display: flex;\n    flex-direction: column;\n    align-items: center;\n    justify-content: center;\n    background-color: transparent;\n}\n\n.LabeledIcon_container__M0F6q:hover {\n    cursor: pointer;\n}\n\n.LabeledIcon_label___0k_1 {\n    font-size: 0.6rem;\n    font-weight: 300;\n}\n\n.LabeledIcon_invisible__1B2ub {\n    visibility: hidden;\n}","",{version:3,sources:["webpack://./components/Primitives/LabeledIcon/LabeledIcon.module.css"],names:[],mappings:"AAAA;IACI,aAAa;IACb,sBAAsB;IACtB,mBAAmB;IACnB,uBAAuB;IACvB,6BAA6B;AACjC;;AAEA;IACI,eAAe;AACnB;;AAEA;IACI,iBAAiB;IACjB,gBAAgB;AACpB;;AAEA;IACI,kBAAkB;AACtB",sourcesContent:[".container {\n    display: flex;\n    flex-direction: column;\n    align-items: center;\n    justify-content: center;\n    background-color: transparent;\n}\n\n.container:hover {\n    cursor: pointer;\n}\n\n.label {\n    font-size: 0.6rem;\n    font-weight: 300;\n}\n\n.invisible {\n    visibility: hidden;\n}"],sourceRoot:""}]),___CSS_LOADER_EXPORT___.locals={container:"LabeledIcon_container__M0F6q",label:"LabeledIcon_label___0k_1",invisible:"LabeledIcon_invisible__1B2ub"};const __WEBPACK_DEFAULT_EXPORT__=___CSS_LOADER_EXPORT___}}]);