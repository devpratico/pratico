"use strict";(self.webpackChunkpratico=self.webpackChunkpratico||[]).push([[148],{"./components/Primitives/LabeledIcon/LabeledIcon.stories.ts":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.r(__webpack_exports__),__webpack_require__.d(__webpack_exports__,{LabeledIcon_:()=>LabeledIcon_,__namedExportsOrder:()=>__namedExportsOrder,default:()=>__WEBPACK_DEFAULT_EXPORT__});const __WEBPACK_DEFAULT_EXPORT__={title:"Composants",component:__webpack_require__("./components/Primitives/LabeledIcon/LabeledIcon.tsx").Z};var LabeledIcon_={args:{type:"play",label:"Play"}};LabeledIcon_.parameters={...LabeledIcon_.parameters,docs:{...LabeledIcon_.parameters?.docs,source:{originalSource:"{\n  args: {\n    type: 'play',\n    label: 'Play'\n  }\n}",...LabeledIcon_.parameters?.docs?.source}}};const __namedExportsOrder=["LabeledIcon_"]},"./components/Primitives/LabeledIcon/LabeledIcon.tsx":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.d(__webpack_exports__,{Z:()=>LabeledIcon});var react=__webpack_require__("./node_modules/.pnpm/next@14.0.3_@babel+core@7.23.6_react-dom@18.2.0_react@18.2.0/node_modules/next/dist/compiled/react/index.js"),injectStylesIntoStyleTag=__webpack_require__("./node_modules/.pnpm/style-loader@3.3.3_webpack@5.89.0/node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js"),injectStylesIntoStyleTag_default=__webpack_require__.n(injectStylesIntoStyleTag),styleDomAPI=__webpack_require__("./node_modules/.pnpm/style-loader@3.3.3_webpack@5.89.0/node_modules/style-loader/dist/runtime/styleDomAPI.js"),styleDomAPI_default=__webpack_require__.n(styleDomAPI),insertBySelector=__webpack_require__("./node_modules/.pnpm/style-loader@3.3.3_webpack@5.89.0/node_modules/style-loader/dist/runtime/insertBySelector.js"),insertBySelector_default=__webpack_require__.n(insertBySelector),setAttributesWithoutAttributes=__webpack_require__("./node_modules/.pnpm/style-loader@3.3.3_webpack@5.89.0/node_modules/style-loader/dist/runtime/setAttributesWithoutAttributes.js"),setAttributesWithoutAttributes_default=__webpack_require__.n(setAttributesWithoutAttributes),insertStyleElement=__webpack_require__("./node_modules/.pnpm/style-loader@3.3.3_webpack@5.89.0/node_modules/style-loader/dist/runtime/insertStyleElement.js"),insertStyleElement_default=__webpack_require__.n(insertStyleElement),styleTagTransform=__webpack_require__("./node_modules/.pnpm/style-loader@3.3.3_webpack@5.89.0/node_modules/style-loader/dist/runtime/styleTagTransform.js"),styleTagTransform_default=__webpack_require__.n(styleTagTransform),LabeledIcon_module=__webpack_require__("./node_modules/.pnpm/css-loader@6.8.1_webpack@5.89.0/node_modules/css-loader/dist/cjs.js??ruleSet[1].rules[8].use[1]!./node_modules/.pnpm/postcss-loader@7.3.3_postcss@8.4.32_typescript@5.3.3_webpack@5.89.0/node_modules/postcss-loader/dist/cjs.js!./components/Primitives/LabeledIcon/LabeledIcon.module.css"),options={};options.styleTagTransform=styleTagTransform_default(),options.setAttributes=setAttributesWithoutAttributes_default(),options.insert=insertBySelector_default().bind(null,"head"),options.domAPI=styleDomAPI_default(),options.insertStyleElement=insertStyleElement_default();injectStylesIntoStyleTag_default()(LabeledIcon_module.Z,options);const LabeledIcon_LabeledIcon_module=LabeledIcon_module.Z&&LabeledIcon_module.Z.locals?LabeledIcon_module.Z.locals:void 0;var Icons=__webpack_require__("./utils/Icons.tsx"),__jsx=react.createElement;function LabeledIcon(_ref){var type=_ref.type,label=_ref.label,hideLabel=_ref.hideLabel,iconColor=_ref.iconColor,labelColor=_ref.labelColor,size=_ref.size,centered=_ref.centered,icon=(0,Icons.q)(type);return size&&(icon=react.cloneElement(icon,{size})),__jsx("div",{className:LabeledIcon_LabeledIcon_module.container},label&&1!=hideLabel&&centered?__jsx("p",{className:"".concat(LabeledIcon_LabeledIcon_module.label," ").concat(LabeledIcon_LabeledIcon_module.invisible)},label):null,__jsx("div",{style:{color:iconColor}},icon),label&&1!=hideLabel?__jsx("p",{className:LabeledIcon_LabeledIcon_module.label,style:{color:labelColor}},label):null)}LabeledIcon.displayName="LabeledIcon";try{LabeledIcon.displayName="LabeledIcon",LabeledIcon.__docgenInfo={description:"",displayName:"LabeledIcon",props:{type:{defaultValue:null,description:"",name:"type",required:!0,type:{name:"enum",value:[{value:'"play"'},{value:'"stopwatch"'},{value:'"puzzle"'},{value:'"chat"'},{value:'"users"'},{value:'"ellipsis"'},{value:'"pause"'},{value:'"stop"'},{value:'"square-plus"'},{value:'"expand"'},{value:'"chevron-left"'},{value:'"chevron-right"'},{value:'"file"'},{value:'"clock-rotate-left"'},{value:'"book"'},{value:'"circle-question"'},{value:'"gear"'},{value:'"file-lines"'},{value:'"grip"'},{value:'"list"'}]}},label:{defaultValue:null,description:"",name:"label",required:!1,type:{name:"string"}},hideLabel:{defaultValue:null,description:"",name:"hideLabel",required:!1,type:{name:"boolean"}},iconColor:{defaultValue:null,description:"",name:"iconColor",required:!1,type:{name:"string"}},labelColor:{defaultValue:null,description:"",name:"labelColor",required:!1,type:{name:"string"}},size:{defaultValue:null,description:"",name:"size",required:!1,type:{name:"enum",value:[{value:'"2xs"'},{value:'"xs"'},{value:'"sm"'},{value:'"lg"'},{value:'"xl"'}]}},centered:{defaultValue:null,description:"If true, the center of the element will be set to the center of the icon.",name:"centered",required:!1,type:{name:"boolean"}}}},"undefined"!=typeof STORYBOOK_REACT_CLASSES&&(STORYBOOK_REACT_CLASSES["components/Primitives/LabeledIcon/LabeledIcon.tsx#LabeledIcon"]={docgenInfo:LabeledIcon.__docgenInfo,name:"LabeledIcon",path:"components/Primitives/LabeledIcon/LabeledIcon.tsx#LabeledIcon"})}catch(__react_docgen_typescript_loader_error){}},"./utils/Icons.tsx":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.d(__webpack_exports__,{q:()=>getIcon});var react__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__("./node_modules/.pnpm/next@14.0.3_@babel+core@7.23.6_react-dom@18.2.0_react@18.2.0/node_modules/next/dist/compiled/react/index.js"),_fortawesome_react_fontawesome__WEBPACK_IMPORTED_MODULE_1__=__webpack_require__("./node_modules/.pnpm/@fortawesome+react-fontawesome@0.2.0_@fortawesome+fontawesome-svg-core@6.5.1_react@18.2.0/node_modules/@fortawesome/react-fontawesome/index.es.js"),_fortawesome_free_solid_svg_icons__WEBPACK_IMPORTED_MODULE_3__=(__webpack_require__("./node_modules/.pnpm/@fortawesome+fontawesome-svg-core@6.5.1/node_modules/@fortawesome/fontawesome-svg-core/styles.css"),__webpack_require__("./node_modules/.pnpm/@fortawesome+free-solid-svg-icons@6.5.1/node_modules/@fortawesome/free-solid-svg-icons/index.mjs")),__jsx=react__WEBPACK_IMPORTED_MODULE_0__.createElement,iconsMap={stopwatch:__jsx(_fortawesome_react_fontawesome__WEBPACK_IMPORTED_MODULE_1__.G,{icon:_fortawesome_free_solid_svg_icons__WEBPACK_IMPORTED_MODULE_3__.U$5}),puzzle:__jsx(_fortawesome_react_fontawesome__WEBPACK_IMPORTED_MODULE_1__.G,{icon:_fortawesome_free_solid_svg_icons__WEBPACK_IMPORTED_MODULE_3__.NxF}),chat:__jsx(_fortawesome_react_fontawesome__WEBPACK_IMPORTED_MODULE_1__.G,{icon:_fortawesome_free_solid_svg_icons__WEBPACK_IMPORTED_MODULE_3__.vto}),users:__jsx(_fortawesome_react_fontawesome__WEBPACK_IMPORTED_MODULE_1__.G,{icon:_fortawesome_free_solid_svg_icons__WEBPACK_IMPORTED_MODULE_3__.FVb}),ellipsis:__jsx(_fortawesome_react_fontawesome__WEBPACK_IMPORTED_MODULE_1__.G,{icon:_fortawesome_free_solid_svg_icons__WEBPACK_IMPORTED_MODULE_3__.S6C}),play:__jsx(_fortawesome_react_fontawesome__WEBPACK_IMPORTED_MODULE_1__.G,{icon:_fortawesome_free_solid_svg_icons__WEBPACK_IMPORTED_MODULE_3__.zc}),pause:__jsx(_fortawesome_react_fontawesome__WEBPACK_IMPORTED_MODULE_1__.G,{icon:_fortawesome_free_solid_svg_icons__WEBPACK_IMPORTED_MODULE_3__.XQY}),stop:__jsx(_fortawesome_react_fontawesome__WEBPACK_IMPORTED_MODULE_1__.G,{icon:_fortawesome_free_solid_svg_icons__WEBPACK_IMPORTED_MODULE_3__.Bg$}),"square-plus":__jsx(_fortawesome_react_fontawesome__WEBPACK_IMPORTED_MODULE_1__.G,{icon:_fortawesome_free_solid_svg_icons__WEBPACK_IMPORTED_MODULE_3__.g6h}),expand:__jsx(_fortawesome_react_fontawesome__WEBPACK_IMPORTED_MODULE_1__.G,{icon:_fortawesome_free_solid_svg_icons__WEBPACK_IMPORTED_MODULE_3__.TL5}),"chevron-left":__jsx(_fortawesome_react_fontawesome__WEBPACK_IMPORTED_MODULE_1__.G,{icon:_fortawesome_free_solid_svg_icons__WEBPACK_IMPORTED_MODULE_3__.A35}),"chevron-right":__jsx(_fortawesome_react_fontawesome__WEBPACK_IMPORTED_MODULE_1__.G,{icon:_fortawesome_free_solid_svg_icons__WEBPACK_IMPORTED_MODULE_3__._tD}),file:__jsx(_fortawesome_react_fontawesome__WEBPACK_IMPORTED_MODULE_1__.G,{icon:_fortawesome_free_solid_svg_icons__WEBPACK_IMPORTED_MODULE_3__.gMD}),"clock-rotate-left":__jsx(_fortawesome_react_fontawesome__WEBPACK_IMPORTED_MODULE_1__.G,{icon:_fortawesome_free_solid_svg_icons__WEBPACK_IMPORTED_MODULE_3__.On6}),book:__jsx(_fortawesome_react_fontawesome__WEBPACK_IMPORTED_MODULE_1__.G,{icon:_fortawesome_free_solid_svg_icons__WEBPACK_IMPORTED_MODULE_3__.FL8}),"circle-question":__jsx(_fortawesome_react_fontawesome__WEBPACK_IMPORTED_MODULE_1__.G,{icon:_fortawesome_free_solid_svg_icons__WEBPACK_IMPORTED_MODULE_3__.FDd}),gear:__jsx(_fortawesome_react_fontawesome__WEBPACK_IMPORTED_MODULE_1__.G,{icon:_fortawesome_free_solid_svg_icons__WEBPACK_IMPORTED_MODULE_3__.gr5}),"file-lines":__jsx(_fortawesome_react_fontawesome__WEBPACK_IMPORTED_MODULE_1__.G,{icon:_fortawesome_free_solid_svg_icons__WEBPACK_IMPORTED_MODULE_3__.nfZ}),grip:__jsx(_fortawesome_react_fontawesome__WEBPACK_IMPORTED_MODULE_1__.G,{icon:_fortawesome_free_solid_svg_icons__WEBPACK_IMPORTED_MODULE_3__.QR4}),list:__jsx(_fortawesome_react_fontawesome__WEBPACK_IMPORTED_MODULE_1__.G,{icon:_fortawesome_free_solid_svg_icons__WEBPACK_IMPORTED_MODULE_3__.Zrf})};function getIcon(type,size){var icon=iconsMap[type];return size&&(icon=react__WEBPACK_IMPORTED_MODULE_0__.cloneElement(icon,{size})),icon}},"./node_modules/.pnpm/css-loader@6.8.1_webpack@5.89.0/node_modules/css-loader/dist/cjs.js??ruleSet[1].rules[8].use[1]!./node_modules/.pnpm/postcss-loader@7.3.3_postcss@8.4.32_typescript@5.3.3_webpack@5.89.0/node_modules/postcss-loader/dist/cjs.js!./components/Primitives/LabeledIcon/LabeledIcon.module.css":(module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.d(__webpack_exports__,{Z:()=>__WEBPACK_DEFAULT_EXPORT__});var _node_modules_pnpm_css_loader_6_8_1_webpack_5_89_0_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__("./node_modules/.pnpm/css-loader@6.8.1_webpack@5.89.0/node_modules/css-loader/dist/runtime/sourceMaps.js"),_node_modules_pnpm_css_loader_6_8_1_webpack_5_89_0_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default=__webpack_require__.n(_node_modules_pnpm_css_loader_6_8_1_webpack_5_89_0_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0__),_node_modules_pnpm_css_loader_6_8_1_webpack_5_89_0_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__=__webpack_require__("./node_modules/.pnpm/css-loader@6.8.1_webpack@5.89.0/node_modules/css-loader/dist/runtime/api.js"),___CSS_LOADER_EXPORT___=__webpack_require__.n(_node_modules_pnpm_css_loader_6_8_1_webpack_5_89_0_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__)()(_node_modules_pnpm_css_loader_6_8_1_webpack_5_89_0_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default());___CSS_LOADER_EXPORT___.push([module.id,".LabeledIcon_container__M0F6q {\n    display: flex;\n    flex-direction: column;\n    align-items: center;\n    justify-content: center;\n    background-color: transparent;\n}\n\n.LabeledIcon_container__M0F6q:hover {\n    cursor: pointer;\n}\n\n.LabeledIcon_label___0k_1 {\n    font-size: 0.6rem;\n    font-weight: 300;\n}\n\n.LabeledIcon_invisible__1B2ub {\n    visibility: hidden;\n}","",{version:3,sources:["webpack://./components/Primitives/LabeledIcon/LabeledIcon.module.css"],names:[],mappings:"AAAA;IACI,aAAa;IACb,sBAAsB;IACtB,mBAAmB;IACnB,uBAAuB;IACvB,6BAA6B;AACjC;;AAEA;IACI,eAAe;AACnB;;AAEA;IACI,iBAAiB;IACjB,gBAAgB;AACpB;;AAEA;IACI,kBAAkB;AACtB",sourcesContent:[".container {\n    display: flex;\n    flex-direction: column;\n    align-items: center;\n    justify-content: center;\n    background-color: transparent;\n}\n\n.container:hover {\n    cursor: pointer;\n}\n\n.label {\n    font-size: 0.6rem;\n    font-weight: 300;\n}\n\n.invisible {\n    visibility: hidden;\n}"],sourceRoot:""}]),___CSS_LOADER_EXPORT___.locals={container:"LabeledIcon_container__M0F6q",label:"LabeledIcon_label___0k_1",invisible:"LabeledIcon_invisible__1B2ub"};const __WEBPACK_DEFAULT_EXPORT__=___CSS_LOADER_EXPORT___}}]);