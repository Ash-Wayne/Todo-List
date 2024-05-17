"use strict";(self.webpackChunktodo_list=self.webpackChunktodo_list||[]).push([[792],{790:(t,n,e)=>{e.d(n,{A:()=>d});var o=e(354),i=e.n(o),A=e(314),r=e.n(A)()(i());r.push([t.id,"html, body, div, span, applet, object, iframe,\nh1, h2, h3, h4, h5, h6, p, blockquote, pre,\na, abbr, acronym, address, big, cite, code,\ndel, dfn, em, img, ins, kbd, q, s, samp,\nsmall, strike, strong, sub, sup, tt, var,\nb, u, i, center,\ndl, dt, dd, ol, ul, li,\nfieldset, form, label, legend,\ntable, caption, tbody, tfoot, thead, tr, th, td,\narticle, aside, canvas, details, embed, \nfigure, figcaption, footer, header, hgroup, \nmenu, nav, output, ruby, section, summary,\ntime, mark, audio, video {\n\tmargin: 0;\n\tpadding: 0;\n\tborder: 0;\n\tfont-size: 100%;\n\tfont: inherit;\n\tvertical-align: baseline;\n}\n/* HTML5 display-role reset for older browsers */\narticle, aside, details, figcaption, figure, \nfooter, header, hgroup, menu, nav, section {\n\tdisplay: block;\n}\nbody {\n\tline-height: 1;\n}\nol, ul {\n\tlist-style: none;\n}\nblockquote, q {\n\tquotes: none;\n}\nblockquote:before, blockquote:after,\nq:before, q:after {\n\tcontent: '';\n\tcontent: none;\n}\ntable {\n\tborder-collapse: collapse;\n\tborder-spacing: 0;\n}","",{version:3,sources:["webpack://./src/css/reset.css"],names:[],mappings:"AAAA;;;;;;;;;;;;;CAaC,SAAS;CACT,UAAU;CACV,SAAS;CACT,eAAe;CACf,aAAa;CACb,wBAAwB;AACzB;AACA,gDAAgD;AAChD;;CAEC,cAAc;AACf;AACA;CACC,cAAc;AACf;AACA;CACC,gBAAgB;AACjB;AACA;CACC,YAAY;AACb;AACA;;CAEC,WAAW;CACX,aAAa;AACd;AACA;CACC,yBAAyB;CACzB,iBAAiB;AAClB",sourcesContent:["html, body, div, span, applet, object, iframe,\nh1, h2, h3, h4, h5, h6, p, blockquote, pre,\na, abbr, acronym, address, big, cite, code,\ndel, dfn, em, img, ins, kbd, q, s, samp,\nsmall, strike, strong, sub, sup, tt, var,\nb, u, i, center,\ndl, dt, dd, ol, ul, li,\nfieldset, form, label, legend,\ntable, caption, tbody, tfoot, thead, tr, th, td,\narticle, aside, canvas, details, embed, \nfigure, figcaption, footer, header, hgroup, \nmenu, nav, output, ruby, section, summary,\ntime, mark, audio, video {\n\tmargin: 0;\n\tpadding: 0;\n\tborder: 0;\n\tfont-size: 100%;\n\tfont: inherit;\n\tvertical-align: baseline;\n}\n/* HTML5 display-role reset for older browsers */\narticle, aside, details, figcaption, figure, \nfooter, header, hgroup, menu, nav, section {\n\tdisplay: block;\n}\nbody {\n\tline-height: 1;\n}\nol, ul {\n\tlist-style: none;\n}\nblockquote, q {\n\tquotes: none;\n}\nblockquote:before, blockquote:after,\nq:before, q:after {\n\tcontent: '';\n\tcontent: none;\n}\ntable {\n\tborder-collapse: collapse;\n\tborder-spacing: 0;\n}"],sourceRoot:""}]);const d=r},621:(t,n,e)=>{e.d(n,{A:()=>d});var o=e(354),i=e.n(o),A=e(314),r=e.n(A)()(i());r.push([t.id,"*,\n::before,\n::after {\n\tpadding: 0;\n\tmargin: 0;\n\toutline: none;\n}\n\nbody {\n\tmin-height: 100vh;\n\tbackground-color: rgba(128, 128, 128, 0.09);\n}\n\n.relative-position {\n\tposition: relative;\n}\n\n.absolute-position {\n\tposition: absolute;\n}\n\nheader {\n\tbackground-color: rgba(255, 68, 0, 0.825);\n\tdisplay: flex;\n\tjustify-content: center;\n\talign-items: center;\n\tfont-size: 3rem;\n\t/* font-weight: bold; */\n\ttext-shadow: 2px 2px 6px rgba(168, 148, 148, 0.8);\n\tbox-shadow: 0px 6px 3px rgba(255, 68, 0, 0.806);\n}\n\nmain {\n\tdisplay: grid;\n\tgrid-template-columns: repeat(auto-fit, 355px);\n\tgrid-auto-rows: 285px;\n\tgap: 20px;\n\tmargin-left: 1.8em;\n\tmargin-top: 1.2em;\n}\n\nmain > div {\n\tdisplay: flex;\n\tflex-direction: column;\n\tjustify-content: space-between;\n\tposition: relative;\n\tborder: 1px solid black;\n\tborder-radius: 1.5em;\n\tbackground-color: rgb(250, 250, 210);\n\tpadding: 0.5em 0 0.8em 0;\n}\n\n.edit-icon-div {\n\twidth: 15px;\n\tright: 30px;\n\ttop: 9px;\n}\n\n.del-icon-div {\n\twidth: 17px;\n\tright: 10px;\n}\n\n.edit-icon {\n\twidth: 15px;\n\theight: auto;\n\tcursor: pointer;\n}\n\n.delete-icon {\n\twidth: 17px;\n\theight: auto;\n\tcursor: pointer;\n}\n\nmain > div:first-child {\n\tgrid-area: 1 / 1 / 2 / 2;\n\tdisplay: flex;\n\tflex-direction: column;\n\tjustify-content: center;\n\talign-items: center;\n\tgap: 1em;\n\tfont-weight: bold;\n}\n\n#plus {\n\tcursor: pointer;\n\twidth: 100px;\n\theight: auto;\n}\n\ndialog:has(.new-project-input-dialog) {\n\twidth: 350px;\n\theight: 140px;\n\tposition: absolute;\n\ttop: 10vh;\n\tright: 0;\n\tleft: 0;\n\tmargin: auto;\n\tborder: 1px solid black;\n}\n\n.new-project-input-dialog {\n\twidth: 100%;\n\theight: 100%;\n\tbackground-color: rgb(232, 230, 230);\n\tdisplay: flex;\n\tflex-direction: column;\n\talign-items: center;\n\tgap: 0.8em;\n}\n\n#close-new-project-input-dialog-btn,\n#close-todo-popup-form-btn,\n#close-checklist-btn {\n\twidth: 15px;\n\theight: auto;\n\talign-self: end;\n\tborder: 1px solid black;\n\tborder-top-style: none;\n\tborder-right-style: none;\n\tborder-radius: 0.1em;\n\tcursor: pointer;\n}\n\n#add-button {\n\twidth: 60px;\n\tcursor: pointer;\n}\n\ndialog:has(.todo-popup-form) {\n\twidth: 430px;\n\theight: 485px;\n\tborder-radius: 0.3em;\n\tposition: absolute;\n\ttop: 0;\n\tright: 0;\n\tbottom: 0;\n\tleft: 0;\n\tmargin: auto;\n\tborder: 1px solid black;\n}\n\n.todo-popup-form {\n\twidth: 410px;\n\theight: 100%;\n\tdisplay: flex;\n\tflex-direction: column;\n\tgap: 1em;\n\tbackground-color: rgb(238, 236, 236);\n\tpadding: 0 0 0 20px;\n}\n\n.todo-popup-form label:first-child,\n#status-label {\n\tdisplay: inline-block;\n\twidth: 80px;\n\ttext-align: right;\n\tvertical-align: top;\n}\n\n.status-options {\n\ttext-align: right;\n\tvertical-align: top;\n}\n\ninput,\ntextarea,\nselect {\n\toutline: none;\n}\n\ntextarea {\n\tfont-family: 'Arial';\n}\n\n#todo-form-project-name {\n\talign-self: center;\n\tmargin-bottom: 0.5em;\n\tfont-weight: bold;\n}\n\n#checklist-btn {\n\talign-self: start;\n\tpadding: 0.1em 0.7em;\n\tmargin-left: 6.4em;\n\tbackground-color: rgb(229, 228, 228);\n\tcursor: pointer;\n}\n\n#checklist-btn:hover {\n\tbackground-color: rgb(250, 250, 9);\n}\n\n#todo-save-btn {\n\talign-self: center;\n\tpadding: 0.1em 0.7em;\n\tcursor: pointer;\n}\n\n.project-name {\n\tfont-weight: bold;\n\ttext-align: center;\n\tfont-size: 1.3rem;\n\toutline: none;\n}\n\n.todo-list {\n\tpadding: 0 1em 1em 1em;\n\theight: 60%;\n\tdisplay: flex;\n\tflex-direction: column;\n\tgap: 0.8em;\n\toverflow-y: auto;\n}\n\n.new-todo-btn {\n\twidth: 50%;\n\talign-self: center;\n\tpadding: 0.5em 0;\n\tborder-radius: 0.5em;\n\tcursor: pointer;\n\toutline: none;\n}\n\n.new-todo-btn:hover {\n\tbackground-color: rgb(255, 140, 0);\n}\n\n.lightgraybg {\n\tbackground-color: lightgray;\n}\n\n.todo {\n\tdisplay: grid;\n\tgrid-template-columns: 1.7fr 0.9fr 0.8fr;\n\tgrid-template-rows: 1fr 1fr;\n\theight: 25%;\n\tgap: 0.3em;\n\tflex-shrink: 0;\n}\n\n.todo-name {\n\twidth: 85%;\n\twhite-space: nowrap;\n\toverflow: hidden;\n\ttext-overflow: ellipsis;\n}\n\n.priority-and-status {\n\tborder: 1px solid black;\n\tborder-radius: 0.4em;\n\ttext-align: center;\n\tfont-size: 0.95rem;\n\tcursor: default;\n}\n\n.edit-and-delete {\n\tborder: 1px solid black;\n\tborder-radius: 0.4em;\n\tcursor: pointer;\n}\n\n.edit-and-delete:hover {\n\tbackground-color: rgb(228, 225, 225);\n}\n\n.lightgreenbg {\n\tbackground-color: lightgreen;\n}\n\n.yellowbg {\n\tbackground-color: yellow;\n}\n\n.redbg {\n\tbackground-color: red;\n}\n\ndialog:has(.confirmation-dialog) {\n\twidth: 350px;\n\theight: 80px;\n\tposition: fixed;\n\ttop: 0;\n\tright: 0;\n\tbottom: 0;\n\tleft: 0;\n\tmargin: auto;\n\tborder: 1px solid black;\n\toverflow: clip;\n}\n\n#confirmation-text {\n\ttext-align: center;\n\tmargin-bottom: 8px;\n}\n\n.confirmation-dialog {\n\tbackground-color: rgb(222, 220, 220);\n\theight: 100%;\n\tpadding-top: 20px;\n}\n\n.yesnobuttonsdiv {\n\tdisplay: flex;\n\tjustify-content: center;\n\tgap: 1em;\n}\n\n#yes-button,\n#no-button {\n\tcursor: pointer;\n\toutline: none;\n\twidth: 10%;\n}\n\n.tooltip-regular {\n\tbackground-color: rgb(236, 234, 234);\n\tfont-size: 14px;\n\tleft: 15px;\n\tbottom: 15px;\n\tz-index: 1;\n}\n\n.tooltip-rightmost {\n\tbackground-color: rgb(236, 234, 234);\n\tfont-size: 14px;\n\tright: 15px;\n\tbottom: 15px;\n\tz-index: 1;\n}\n\n.hidden {\n\tvisibility: hidden;\n}\n\ndialog:has(.checklist) {\n\twidth: 430px;\n\theight: 485px;\n\tborder-radius: 0.3em;\n\tposition: fixed;\n\ttop: 0;\n\tright: 0;\n\tbottom: 0;\n\tleft: 0;\n\tmargin: auto;\n\tborder: 1px solid black;\n}\n\n.checklist {\n\twidth: 430px;\n\theight: 100%;\n\tdisplay: flex;\n\tflex-direction: column;\n\tgap: 1.5em;\n\tbackground-color: rgb(214, 211, 211);\n\toverflow-y: auto;\n}\n\n#checklist-heading {\n\talign-self: center;\n\tfont-weight: bold;\n\tborder-bottom: 1px solid black;\n\tpadding-bottom: 0.05em;\n\tletter-spacing: 0.04em;\n}\n\n.checklist-bottom-buttons-div {\n\tdisplay: flex;\n\tgap: 1em;\n\talign-self: center;\n\tmargin-top: 1em;\n\tmargin-bottom: 1em;\n}\n\n#add-new-item-btn,\n#done-checklist-btn,\n#save-new-checklist-item-btn {\n\twidth: 8em;\n\tborder: 1px solid black;\n\tborder-radius: 0.4em;\n\tpadding: 0.2em 0;\n\tbackground-color: rgb(232, 230, 230);\n\toutline: none;\n\tcursor: pointer;\n}\n\n#add-new-item-btn:hover,\n#done-checklist-btn:hover,\n#save-new-checklist-item-btn:hover {\n\tbackground-color: rgb(222, 219, 219);\n}\n\n.checklist-items-div {\n\tdisplay: flex;\n\tflex-direction: column;\n\tgap: 2em;\n}\n\n.checklist-item-div {\n\tdisplay: grid;\n\tgrid-template-columns: 5fr 1.6fr 1fr 1fr;\n\tmargin-left: 1.8em;\n}\n\n.input-field-div-for-new-item {\n\tdisplay: flex;\n\tjustify-content: center;\n\tgap: 2em;\n}\n\n.display-none {\n\tdisplay: none;\n}\n","",{version:3,sources:["webpack://./src/css/styles.css"],names:[],mappings:"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",sourcesContent:["*,\n::before,\n::after {\n\tpadding: 0;\n\tmargin: 0;\n\toutline: none;\n}\n\nbody {\n\tmin-height: 100vh;\n\tbackground-color: rgba(128, 128, 128, 0.09);\n}\n\n.relative-position {\n\tposition: relative;\n}\n\n.absolute-position {\n\tposition: absolute;\n}\n\nheader {\n\tbackground-color: rgba(255, 68, 0, 0.825);\n\tdisplay: flex;\n\tjustify-content: center;\n\talign-items: center;\n\tfont-size: 3rem;\n\t/* font-weight: bold; */\n\ttext-shadow: 2px 2px 6px rgba(168, 148, 148, 0.8);\n\tbox-shadow: 0px 6px 3px rgba(255, 68, 0, 0.806);\n}\n\nmain {\n\tdisplay: grid;\n\tgrid-template-columns: repeat(auto-fit, 355px);\n\tgrid-auto-rows: 285px;\n\tgap: 20px;\n\tmargin-left: 1.8em;\n\tmargin-top: 1.2em;\n}\n\nmain > div {\n\tdisplay: flex;\n\tflex-direction: column;\n\tjustify-content: space-between;\n\tposition: relative;\n\tborder: 1px solid black;\n\tborder-radius: 1.5em;\n\tbackground-color: rgb(250, 250, 210);\n\tpadding: 0.5em 0 0.8em 0;\n}\n\n.edit-icon-div {\n\twidth: 15px;\n\tright: 30px;\n\ttop: 9px;\n}\n\n.del-icon-div {\n\twidth: 17px;\n\tright: 10px;\n}\n\n.edit-icon {\n\twidth: 15px;\n\theight: auto;\n\tcursor: pointer;\n}\n\n.delete-icon {\n\twidth: 17px;\n\theight: auto;\n\tcursor: pointer;\n}\n\nmain > div:first-child {\n\tgrid-area: 1 / 1 / 2 / 2;\n\tdisplay: flex;\n\tflex-direction: column;\n\tjustify-content: center;\n\talign-items: center;\n\tgap: 1em;\n\tfont-weight: bold;\n}\n\n#plus {\n\tcursor: pointer;\n\twidth: 100px;\n\theight: auto;\n}\n\ndialog:has(.new-project-input-dialog) {\n\twidth: 350px;\n\theight: 140px;\n\tposition: absolute;\n\ttop: 10vh;\n\tright: 0;\n\tleft: 0;\n\tmargin: auto;\n\tborder: 1px solid black;\n}\n\n.new-project-input-dialog {\n\twidth: 100%;\n\theight: 100%;\n\tbackground-color: rgb(232, 230, 230);\n\tdisplay: flex;\n\tflex-direction: column;\n\talign-items: center;\n\tgap: 0.8em;\n}\n\n#close-new-project-input-dialog-btn,\n#close-todo-popup-form-btn,\n#close-checklist-btn {\n\twidth: 15px;\n\theight: auto;\n\talign-self: end;\n\tborder: 1px solid black;\n\tborder-top-style: none;\n\tborder-right-style: none;\n\tborder-radius: 0.1em;\n\tcursor: pointer;\n}\n\n#add-button {\n\twidth: 60px;\n\tcursor: pointer;\n}\n\ndialog:has(.todo-popup-form) {\n\twidth: 430px;\n\theight: 485px;\n\tborder-radius: 0.3em;\n\tposition: absolute;\n\ttop: 0;\n\tright: 0;\n\tbottom: 0;\n\tleft: 0;\n\tmargin: auto;\n\tborder: 1px solid black;\n}\n\n.todo-popup-form {\n\twidth: 410px;\n\theight: 100%;\n\tdisplay: flex;\n\tflex-direction: column;\n\tgap: 1em;\n\tbackground-color: rgb(238, 236, 236);\n\tpadding: 0 0 0 20px;\n}\n\n.todo-popup-form label:first-child,\n#status-label {\n\tdisplay: inline-block;\n\twidth: 80px;\n\ttext-align: right;\n\tvertical-align: top;\n}\n\n.status-options {\n\ttext-align: right;\n\tvertical-align: top;\n}\n\ninput,\ntextarea,\nselect {\n\toutline: none;\n}\n\ntextarea {\n\tfont-family: 'Arial';\n}\n\n#todo-form-project-name {\n\talign-self: center;\n\tmargin-bottom: 0.5em;\n\tfont-weight: bold;\n}\n\n#checklist-btn {\n\talign-self: start;\n\tpadding: 0.1em 0.7em;\n\tmargin-left: 6.4em;\n\tbackground-color: rgb(229, 228, 228);\n\tcursor: pointer;\n}\n\n#checklist-btn:hover {\n\tbackground-color: rgb(250, 250, 9);\n}\n\n#todo-save-btn {\n\talign-self: center;\n\tpadding: 0.1em 0.7em;\n\tcursor: pointer;\n}\n\n.project-name {\n\tfont-weight: bold;\n\ttext-align: center;\n\tfont-size: 1.3rem;\n\toutline: none;\n}\n\n.todo-list {\n\tpadding: 0 1em 1em 1em;\n\theight: 60%;\n\tdisplay: flex;\n\tflex-direction: column;\n\tgap: 0.8em;\n\toverflow-y: auto;\n}\n\n.new-todo-btn {\n\twidth: 50%;\n\talign-self: center;\n\tpadding: 0.5em 0;\n\tborder-radius: 0.5em;\n\tcursor: pointer;\n\toutline: none;\n}\n\n.new-todo-btn:hover {\n\tbackground-color: rgb(255, 140, 0);\n}\n\n.lightgraybg {\n\tbackground-color: lightgray;\n}\n\n.todo {\n\tdisplay: grid;\n\tgrid-template-columns: 1.7fr 0.9fr 0.8fr;\n\tgrid-template-rows: 1fr 1fr;\n\theight: 25%;\n\tgap: 0.3em;\n\tflex-shrink: 0;\n}\n\n.todo-name {\n\twidth: 85%;\n\twhite-space: nowrap;\n\toverflow: hidden;\n\ttext-overflow: ellipsis;\n}\n\n.priority-and-status {\n\tborder: 1px solid black;\n\tborder-radius: 0.4em;\n\ttext-align: center;\n\tfont-size: 0.95rem;\n\tcursor: default;\n}\n\n.edit-and-delete {\n\tborder: 1px solid black;\n\tborder-radius: 0.4em;\n\tcursor: pointer;\n}\n\n.edit-and-delete:hover {\n\tbackground-color: rgb(228, 225, 225);\n}\n\n.lightgreenbg {\n\tbackground-color: lightgreen;\n}\n\n.yellowbg {\n\tbackground-color: yellow;\n}\n\n.redbg {\n\tbackground-color: red;\n}\n\ndialog:has(.confirmation-dialog) {\n\twidth: 350px;\n\theight: 80px;\n\tposition: fixed;\n\ttop: 0;\n\tright: 0;\n\tbottom: 0;\n\tleft: 0;\n\tmargin: auto;\n\tborder: 1px solid black;\n\toverflow: clip;\n}\n\n#confirmation-text {\n\ttext-align: center;\n\tmargin-bottom: 8px;\n}\n\n.confirmation-dialog {\n\tbackground-color: rgb(222, 220, 220);\n\theight: 100%;\n\tpadding-top: 20px;\n}\n\n.yesnobuttonsdiv {\n\tdisplay: flex;\n\tjustify-content: center;\n\tgap: 1em;\n}\n\n#yes-button,\n#no-button {\n\tcursor: pointer;\n\toutline: none;\n\twidth: 10%;\n}\n\n.tooltip-regular {\n\tbackground-color: rgb(236, 234, 234);\n\tfont-size: 14px;\n\tleft: 15px;\n\tbottom: 15px;\n\tz-index: 1;\n}\n\n.tooltip-rightmost {\n\tbackground-color: rgb(236, 234, 234);\n\tfont-size: 14px;\n\tright: 15px;\n\tbottom: 15px;\n\tz-index: 1;\n}\n\n.hidden {\n\tvisibility: hidden;\n}\n\ndialog:has(.checklist) {\n\twidth: 430px;\n\theight: 485px;\n\tborder-radius: 0.3em;\n\tposition: fixed;\n\ttop: 0;\n\tright: 0;\n\tbottom: 0;\n\tleft: 0;\n\tmargin: auto;\n\tborder: 1px solid black;\n}\n\n.checklist {\n\twidth: 430px;\n\theight: 100%;\n\tdisplay: flex;\n\tflex-direction: column;\n\tgap: 1.5em;\n\tbackground-color: rgb(214, 211, 211);\n\toverflow-y: auto;\n}\n\n#checklist-heading {\n\talign-self: center;\n\tfont-weight: bold;\n\tborder-bottom: 1px solid black;\n\tpadding-bottom: 0.05em;\n\tletter-spacing: 0.04em;\n}\n\n.checklist-bottom-buttons-div {\n\tdisplay: flex;\n\tgap: 1em;\n\talign-self: center;\n\tmargin-top: 1em;\n\tmargin-bottom: 1em;\n}\n\n#add-new-item-btn,\n#done-checklist-btn,\n#save-new-checklist-item-btn {\n\twidth: 8em;\n\tborder: 1px solid black;\n\tborder-radius: 0.4em;\n\tpadding: 0.2em 0;\n\tbackground-color: rgb(232, 230, 230);\n\toutline: none;\n\tcursor: pointer;\n}\n\n#add-new-item-btn:hover,\n#done-checklist-btn:hover,\n#save-new-checklist-item-btn:hover {\n\tbackground-color: rgb(222, 219, 219);\n}\n\n.checklist-items-div {\n\tdisplay: flex;\n\tflex-direction: column;\n\tgap: 2em;\n}\n\n.checklist-item-div {\n\tdisplay: grid;\n\tgrid-template-columns: 5fr 1.6fr 1fr 1fr;\n\tmargin-left: 1.8em;\n}\n\n.input-field-div-for-new-item {\n\tdisplay: flex;\n\tjustify-content: center;\n\tgap: 2em;\n}\n\n.display-none {\n\tdisplay: none;\n}\n"],sourceRoot:""}]);const d=r},450:(t,n,e)=>{e.d(n,{A:()=>d});var o=e(354),i=e.n(o),A=e(314),r=e.n(A)()(i());r.push([t.id,"/* The switch - the box around the slider */\n.switch {\n\tposition: relative;\n\tdisplay: inline-block;\n\twidth: 42px;\n\theight: 17px;\n}\n\n/* Hide default HTML checkbox */\n.switch input {\n\topacity: 0;\n\twidth: 0;\n\theight: 0;\n}\n\n/* The slider */\n.slider {\n\tposition: absolute;\n\tcursor: pointer;\n\ttop: 0;\n\tleft: 0;\n\tright: 0;\n\tbottom: 0;\n\tbackground-color: #b6b4b4;\n\t-webkit-transition: 0.4s;\n\ttransition: 0.4s;\n}\n\n.slider:before {\n\tposition: absolute;\n\tcontent: '';\n\theight: 13px;\n\twidth: 13px;\n\tleft: 1px;\n\tbottom: 2px;\n\tbackground-color: white;\n\t-webkit-transition: 0.4s;\n\ttransition: 0.4s;\n}\n\ninput:checked + .slider {\n\tbackground-color: #2196f3;\n}\n\ninput:checked + .slider:before {\n\t-webkit-transform: translateX(27px);\n\t-ms-transform: translateX(27px);\n\ttransform: translateX(27px);\n}\n\n/* Rounded sliders */\n.slider.round {\n\tborder-radius: 34px;\n}\n\n.slider.round:before {\n\tborder-radius: 50%;\n}\n","",{version:3,sources:["webpack://./src/css/toggle-switch.css"],names:[],mappings:"AAAA,2CAA2C;AAC3C;CACC,kBAAkB;CAClB,qBAAqB;CACrB,WAAW;CACX,YAAY;AACb;;AAEA,+BAA+B;AAC/B;CACC,UAAU;CACV,QAAQ;CACR,SAAS;AACV;;AAEA,eAAe;AACf;CACC,kBAAkB;CAClB,eAAe;CACf,MAAM;CACN,OAAO;CACP,QAAQ;CACR,SAAS;CACT,yBAAyB;CACzB,wBAAwB;CACxB,gBAAgB;AACjB;;AAEA;CACC,kBAAkB;CAClB,WAAW;CACX,YAAY;CACZ,WAAW;CACX,SAAS;CACT,WAAW;CACX,uBAAuB;CACvB,wBAAwB;CACxB,gBAAgB;AACjB;;AAEA;CACC,yBAAyB;AAC1B;;AAEA;CACC,mCAAmC;CACnC,+BAA+B;CAC/B,2BAA2B;AAC5B;;AAEA,oBAAoB;AACpB;CACC,mBAAmB;AACpB;;AAEA;CACC,kBAAkB;AACnB",sourcesContent:["/* The switch - the box around the slider */\n.switch {\n\tposition: relative;\n\tdisplay: inline-block;\n\twidth: 42px;\n\theight: 17px;\n}\n\n/* Hide default HTML checkbox */\n.switch input {\n\topacity: 0;\n\twidth: 0;\n\theight: 0;\n}\n\n/* The slider */\n.slider {\n\tposition: absolute;\n\tcursor: pointer;\n\ttop: 0;\n\tleft: 0;\n\tright: 0;\n\tbottom: 0;\n\tbackground-color: #b6b4b4;\n\t-webkit-transition: 0.4s;\n\ttransition: 0.4s;\n}\n\n.slider:before {\n\tposition: absolute;\n\tcontent: '';\n\theight: 13px;\n\twidth: 13px;\n\tleft: 1px;\n\tbottom: 2px;\n\tbackground-color: white;\n\t-webkit-transition: 0.4s;\n\ttransition: 0.4s;\n}\n\ninput:checked + .slider {\n\tbackground-color: #2196f3;\n}\n\ninput:checked + .slider:before {\n\t-webkit-transform: translateX(27px);\n\t-ms-transform: translateX(27px);\n\ttransform: translateX(27px);\n}\n\n/* Rounded sliders */\n.slider.round {\n\tborder-radius: 34px;\n}\n\n.slider.round:before {\n\tborder-radius: 50%;\n}\n"],sourceRoot:""}]);const d=r},836:(t,n,e)=>{e.d(n,{F:()=>et,X:()=>it});var o=e(72),i=e.n(o),A=e(825),r=e.n(A),d=e(659),l=e.n(d),a=e(56),s=e.n(a),c=e(540),C=e.n(c),u=e(113),p=e.n(u),m=e(790),g={};g.styleTagTransform=p(),g.setAttributes=s(),g.insert=l().bind(null,"head"),g.domAPI=r(),g.insertStyleElement=C(),i()(m.A,g),m.A&&m.A.locals&&m.A.locals;var h=e(621),b={};b.styleTagTransform=p(),b.setAttributes=s(),b.insert=l().bind(null,"head"),b.domAPI=r(),b.insertStyleElement=C(),i()(h.A,b),h.A&&h.A.locals&&h.A.locals;var f=e(224),B=e.n(f);function k(t){return JSON.parse(localStorage.getItem(t))}function v(t,n){n.lastUpdated=new Date,localStorage.setItem(t,JSON.stringify(n))}function y(t){localStorage.removeItem(t)}var w=e(100);let x=[];function E(t){x=t}function N(t){for(let n of x)if(n.uniqueId===t)return n}const L=e.p+"a4e3ae561515a42e5a25.png",j=e.p+"4cf85250644be08b0e98.png";function I(t){let n=t.textContent;return t.contentEditable=!0,t.setAttribute("spellcheck","false"),window.getSelection().selectAllChildren(t),n}function S(t,n,e){t.addEventListener("keydown",(function o(i){if("Enter"===i.key||"Escape"===i.key){i.stopPropagation(),i.preventDefault(),t.contentEditable=!1,window.getSelection().removeAllRanges();let A=t.textContent;"editProjectName"===e?t.parentNode.dataset.project=A:"editChecklistItem"===e&&(t.parentNode.dataset.itemName=A),B().publish(e,{identifier:n,newName:A}),t.removeEventListener("keydown",o)}}))}var F=e(450),T={};T.styleTagTransform=p(),T.setAttributes=s(),T.insert=l().bind(null,"head"),T.domAPI=r(),T.insertStyleElement=C(),i()(F.A,T),F.A&&F.A.locals&&F.A.locals;const D={checklistPopup:document.querySelector("dialog:has(.checklist)"),checklistBottomBtnsDiv:document.querySelector(".checklist-bottom-buttons-div"),addNewItemBtn:document.getElementById("add-new-item-btn"),doneChecklistBtn:document.getElementById("done-checklist-btn"),closeBtn:document.getElementById("close-checklist-btn"),inputFieldDivForNewItem:document.querySelector(".input-field-div-for-new-item"),inputFieldForNewItem:document.getElementById("input-field-for-new-item"),saveNewChecklistItemBtn:document.getElementById("save-new-checklist-item-btn"),checklistItemsDiv:document.querySelector(".checklist-items-div")};function P(){for(;D.checklistItemsDiv.children.length>1;)D.checklistItemsDiv.removeChild(D.checklistItemsDiv.firstElementChild)}function Y(){const t=function(t){"keydown"===t.type&&"Escape"!==t.key||("keydown"===t.type&&"Escape"===t.key&&t.preventDefault(),U(),O(),D.checklistPopup.close(),function(){const t=et.closeChecklistPopup,n=et.saveNewChecklistItem;D.addNewItemBtn.removeEventListener("click",q),D.doneChecklistBtn.removeEventListener("click",t),D.closeBtn.removeEventListener("click",t),D.checklistPopup.removeEventListener("keydown",t),D.saveNewChecklistItemBtn.removeEventListener("click",n),D.inputFieldForNewItem.removeEventListener("keydown",n)}())},n=function(t){if("keydown"===t.type&&"Enter"!==t.key)return;"keydown"===t.type&&"Enter"===t.key&&t.preventDefault();let n=Math.random();W(n,D.inputFieldForNewItem.value,!1),function(t,n,e){B().publish("addToChecklist",{uniqueId:t,itemName:n,itemStatus:!1})}(n,D.inputFieldForNewItem.value),U(),O(),D.checklistPopup.focus()};D.addNewItemBtn.addEventListener("click",q),D.doneChecklistBtn.addEventListener("click",t),D.closeBtn.addEventListener("click",t),D.checklistPopup.addEventListener("keydown",t),D.saveNewChecklistItemBtn.addEventListener("click",n),D.inputFieldForNewItem.addEventListener("keydown",n),et.closeChecklistPopup=t,et.saveNewChecklistItem=n}function q(){D.inputFieldDivForNewItem.classList.remove("display-none"),D.inputFieldForNewItem.focus()}function W(t,n,e){const o=document.createElement("div");o.classList.add("checklist-item-div"),o.dataset.uniqueId=t,o.dataset.itemName=n;const i=document.createElement("p");i.textContent=n,i.setAttribute("spellcheck","false");const A=function(t,n){const e=document.createElement("label");e.classList.add("switch");const o=document.createElement("input");o.setAttribute("id",Math.random().toString()),o.setAttribute("type","checkbox"),!1===n?o.checked=!1:!0===n&&(o.checked=!0);const i=document.createElement("span");return i.classList.add("slider","round"),o.addEventListener("change",(n=>{!function(t,n){B().publish("changeItemStatus",{uniqueId:t,newStatus:n})}(t,o.checked)})),e.append(o,i),e}(t,e),r=function(t){const n=new Image;return n.src=L,n.classList.add("edit-icon"),n.addEventListener("click",(n=>{I(t),S(t,parseFloat(t.parentNode.dataset.uniqueId),"editChecklistItem")})),n}(i),d=function(t){const n=new Image;return n.src=j,n.classList.add("delete-icon"),n.addEventListener("click",(n=>{!function(t){for(let n of D.checklistItemsDiv.children)if(n.dataset.uniqueId===t.toString()){D.checklistItemsDiv.removeChild(n);break}}(t),function(t){B().publish("removeChecklistItem",t)}(t)})),n}(t);o.append(i,A,r,d),D.checklistItemsDiv.lastElementChild.insertAdjacentElement("beforebegin",o)}function U(){D.inputFieldDivForNewItem.classList.add("display-none")}function O(){D.inputFieldForNewItem.value=""}const X=function(){const t=document.querySelector("dialog:has(.todo-popup-form)"),n=document.getElementById("close-todo-popup-form-btn"),e=document.getElementById("todo-form-project-name"),o=document.getElementById("todo-name"),i=document.getElementById("description"),A=document.getElementById("due-date"),r=document.getElementById("not-started"),d=document.getElementById("in-progress"),l=document.getElementById("complete"),a=document.getElementById("priority"),s=document.getElementById("notes"),c=document.getElementById("checklist-btn"),C=document.getElementById("todo-save-btn");let u=[];return{setChecklistValue:function(t){u=t},getTodoFormInputFieldValues:function(){return{todoName:o.value,description:i.value,due:A.value,priority:a.value,todoStatus:M().value,notes:s.value,checklist:u}},todoPopupForm:t,closeBtn:n,project:e,todoNameField:o,description:i,dueDateField:A,notStartedStatus:r,inProgressStatus:d,completeStatus:l,priorityField:a,notes:s,checklistBtn:c,saveBtn:C}}();function M(){return document.querySelector('input[name="status"]:checked')}function Q(t,n){X.project.textContent=`Project: ${t}`,X.todoPopupForm.showModal(),"New"===n?(X.todoNameField.removeAttribute("readonly"),X.todoNameField.classList.remove("lightgraybg"),X.todoNameField.focus()):"Edit"===n&&(X.todoNameField.setAttribute("readonly",!0),X.todoNameField.classList.add("lightgraybg"),X.todoPopupForm.focus())}function Z(t,n){const e=function(t){X.getTodoFormInputFieldValues().checklist.length>0&&B().publish("reloadChecklist",X.getTodoFormInputFieldValues().checklist),function(){let t=X.getTodoFormInputFieldValues().checklist;t.length>0&&(P(),t.forEach((t=>{W(t.uniqueId,t.itemName,t.itemStatus)})))}(),D.checklistPopup.showModal(),Y()},o=function(e){if("keydown"!==e.type||"Escape"===e.key){if("todo-save-btn"===e.target.id){if(!1===function(t,n){return""===X.todoNameField.value?(alert("Title is mandatory!"),!1):"New"===n&&function(t,n){let e;for(let o of k(t).listOfTodos)if(o.todoName===n)return e=o,e;return!1}(t,X.todoNameField.value).todoName===X.todoNameField.value?(alert("Todo already exists"),!1):void 0}(t,n))return;X.setChecklistValue(x);let{todoList:e,todo:o}=function(t,n){const e=function(t){return K(t).children[3]}(t),o=z(X.todoNameField.value,X.dueDateField.value,X.priorityField.value,M().value);if(V(t,e,X.getTodoFormInputFieldValues(),o.children[2],o.children[5]),"New"===n)e.appendChild(o);else if("Edit"===n){let t;for(let n of e.children)n.dataset.name===X.todoNameField.value&&(t=n);e.replaceChild(o,t)}return{todoList:e,todo:o}}(t,n);!function(t,n){setTimeout((()=>{t.scrollTop=n.offsetTop}),10)}(e,o),function(t,n){let e,o="";""!==X.dueDateField.value&&(o=X.dueDateField.value+"T00:00:00"),"New"===n?e="createTodo":"Edit"===n&&(e="updateTodo"),B().publish(e,{projectName:t,todoName:X.todoNameField.value,description:X.description.value,dueDate:o,priority:X.priorityField.value,status:M().value,notes:X.notes.value,checklist:X.getTodoFormInputFieldValues().checklist})}(t,n)}X.todoPopupForm.close(),X.todoNameField.value="",X.description.value="",X.dueDateField.value="",X.notStartedStatus.checked=!0,X.priorityField.value="Medium",X.notes.value="",X.setChecklistValue([]),function(){const t=et.onClickChecklistBtn,n=et.saveOrEscOrCloseTodoForm;X.checklistBtn.removeEventListener("click",t),X.saveBtn.removeEventListener("click",n),X.closeBtn.removeEventListener("click",n),X.todoPopupForm.removeEventListener("keydown",n)}(),P(),B().publish("clearChecklist",null)}};X.checklistBtn.addEventListener("click",e),X.saveBtn.addEventListener("click",o),X.closeBtn.addEventListener("click",o),X.todoPopupForm.addEventListener("keydown",o),et.onClickChecklistBtn=e,et.saveOrEscOrCloseTodoForm=o}function z(t,n,e,o){const i=document.createElement("div"),A=document.createElement("h3"),r=document.createElement("p"),d=document.createElement("p"),l=document.createElement("p"),a=document.createElement("button"),s=document.createElement("button");return i.classList.add("todo"),i.dataset.name=t,A.classList.add("todo-name"),A.textContent=t,r.textContent=function(t){let n;return t.includes("from database:")?(n=`Due: ${t.split(":")[1]}`,""===t.split(":")[1]&&(n+="Not Specified")):""!==t?n=`Due: ${(0,w.GP)(t+"T00:00:00","MM/dd/yyyy")}`:""===t&&(n="Due: Not Specified"),n}(n),d.textContent=e,d.classList.add("priority-and-status"),l.textContent=o,l.classList.add("priority-and-status"),function(t,n,e,o){switch(n){case"Low":t.classList.add("lightgreenbg");break;case"Medium":t.classList.add("yellowbg");break;case"High":t.classList.add("redbg")}switch(o){case"Not Started":e.classList.add("redbg");break;case"In-Progress":e.classList.add("yellowbg");break;case"Complete":e.classList.add("lightgreenbg")}}(d,e,l,o),a.textContent="View/Edit",a.classList.add("edit-and-delete"),s.textContent="Delete",s.classList.add("edit-and-delete"),i.append(A,d,a,r,l,s),i}function V(t,n,e,o,i){let A=e.todoName,r=e.description,d=e.due,l=e.priority,a=e.todoStatus,s=e.notes,c=e.checklist;o.addEventListener("click",(n=>{var e;X.todoNameField.value=A,X.description.value=r,X.dueDateField.value=d,X.priorityField.value=l,(e=a,"Not Started"===e?X.notStartedStatus:"In-Progress"===e?X.inProgressStatus:"Complete"===e?X.completeStatus:void 0).checked=!0,X.notes.value=s,X.setChecklistValue(JSON.parse(JSON.stringify(c))),Q(t,"Edit"),Z(t,"Edit")})),i.addEventListener("click",(e=>{for(let e of n.children)e.dataset.name===A&&(n.removeChild(e),B().publish("deleteTodo",{projectName:t,todoName:A}))}))}const R={mainDiv:document.querySelector("main"),addNewProjectDiv:document.querySelector("main > div:first-child")},G={confirmDialog:document.querySelector("dialog:has(.confirmation-dialog)"),yesBtn:document.getElementById("yes-button"),noBtn:document.getElementById("no-button")};function H(t){const n=document.createElement("div");n.dataset.project=t;const e=document.createElement("h2");e.textContent=t,e.classList.add("project-name");const o=function(t){const n=document.createElement("div");n.classList.add("edit-icon-div","absolute-position");const e=new Image;return e.src=L,e.classList.add("edit-icon"),n.append(e,J(e,"Edit project name")),e.addEventListener("click",(n=>{let e=t.children[0];S(e,I(e),"editProjectName")})),n}(n),i=function(t){const n=document.createElement("div");n.classList.add("del-icon-div","absolute-position");const e=new Image;return e.src=j,e.classList.add("delete-icon"),n.append(e,J(e,"Delete project")),e.addEventListener("click",(n=>{$("Show"),function(t){function n(n){"keydown"===n.type&&"Enter"!==n.key||(function(t){R.mainDiv.removeChild(t)}(t),function(t){B().publish("deleteProject",t)}(t.dataset.project),_())}function e(t){"keydown"===t.type&&"Escape"!==t.key||_()}G.yesBtn.addEventListener("click",n),G.confirmDialog.addEventListener("keydown",n),G.noBtn.addEventListener("click",e),G.confirmDialog.addEventListener("keydown",e),et.confirmProjectDeletion=n,et.rejectProjectDeletion=e}(t)})),n}(n),A=document.createElement("div");A.classList.add("todo-list"),A.classList.add("relative-position");for(let n of it())if(n.projectName===t){n.projectTodos.forEach((n=>{const e=z(n.todoName,"from database:"+n.due,n.priority,n.todoStatus);V(t,A,n,e.children[2],e.children[5]),A.appendChild(e)}));break}const r=document.createElement("button");r.textContent="Add New Todo",r.classList.add("new-todo-btn"),r.addEventListener("click",(n=>{Q(t,"New"),Z(t,"New")})),n.append(e,o,i,A,r),R.addNewProjectDiv.insertAdjacentElement("afterend",n),B().publish("projectPositionChange",null),!0===function(t){if(0===it().length)return!0;for(let n of it())if(n.projectName===t)return!1;return!0}(t)&&B().publish("addNewProject",t)}function J(t,n){const e=document.createElement("p");let o;function i(){e.classList.remove("hidden")}return e.textContent=n,e.setAttribute("style",`width: ${n.length-2}ch;`),e.classList.add("tooltip","absolute-position","hidden"),t.addEventListener("mouseenter",(t=>{o=setTimeout(i,500)})),t.addEventListener("mouseleave",(t=>{e.classList.add("hidden"),clearTimeout(o)})),e}function $(t){"Show"===t?G.confirmDialog.showModal():"Close"===t&&G.confirmDialog.close()}function _(){$("Close"),function(){const t=et.confirmProjectDeletion,n=et.rejectProjectDeletion;G.yesBtn.removeEventListener("click",t),G.confirmDialog.removeEventListener("keydown",t),G.noBtn.removeEventListener("click",n),G.confirmDialog.removeEventListener("keydown",n)}()}function K(t){for(let n of tt())if(n.dataset.project===t)return n}function tt(){return Array.from(document.querySelectorAll("main > div")).toSpliced(0,1)}function nt(t,n){let e=K(n.projectName);R.addNewProjectDiv.insertAdjacentElement("afterend",e),B().publish("projectPositionChange",null)}B().subscribe("createTodo",nt),B().subscribe("updateTodo",nt),B().subscribe("projectPositionChange",(function(t,n){for(let t of tt())if(t.offsetLeft>1e3)for(let n of Array.from(t.querySelectorAll(".tooltip")))n.classList.remove("tooltip-regular"),n.classList.add("tooltip-rightmost");else if(t.offsetLeft<=1e3)for(let n of Array.from(t.querySelectorAll(".tooltip")))n.classList.remove("tooltip-rightmost"),n.classList.add("tooltip-regular")}));const et={onClickChecklistBtn:void 0,saveOrEscOrCloseTodoForm:void 0,closeChecklistPopup:void 0,saveNewChecklistItem:void 0,confirmProjectDeletion:void 0,rejectProjectDeletion:void 0};B().subscribe("addNewProject",(function(t,n){var e;e=n,localStorage.setItem(e,JSON.stringify({lastUpdated:new Date,listOfTodos:[]}))})),B().subscribe("createTodo",(function(t,n){!function(t,n,e="",o="",i="",A="",r="",d){let l;l=""===o?"":(0,w.GP)(o,"MM/dd/yyyy");let a=k(t),s={todoName:n,description:e,due:l,priority:i,todoStatus:A,notes:r,checklist:d};a.listOfTodos.push(s),v(t,a)}(n.projectName,n.todoName,n.description,n.dueDate,n.priority,n.status,n.notes,n.checklist)})),B().subscribe("updateTodo",(function(t,n){!function(t,n,e="",o="",i="",A,r="",d){let l;l=""===o?"":(0,w.GP)(o,"MM/dd/yyyy");let a={todoName:n,description:e,due:l,priority:i,todoStatus:A,notes:r,checklist:d},s=k(t),c=s.listOfTodos.findIndex((t=>{if(t.todoName===n)return!0}));s.listOfTodos[c]=a,v(t,s)}(n.projectName,n.todoName,n.description,n.dueDate,n.priority,n.status,n.notes,n.checklist)})),B().subscribe("deleteTodo",(function(t,n){!function(t,n){let e=k(t),o=e.listOfTodos.findIndex((t=>{if(t.todoName===n)return!0}));e.listOfTodos.splice(o,1),v(t,e)}(n.projectName,n.todoName)})),B().subscribe("editProjectName",(function(t,n){let e=k(n.identifier);y(n.identifier),v(n.newName,e)})),B().subscribe("deleteProject",(function(t,n){y(n)})),B().subscribe("addToChecklist",(function(t,n){!function(t,n,e){let o={uniqueId:t,itemName:n,itemStatus:e};x.push(o)}(n.uniqueId,n.itemName,n.itemStatus)})),B().subscribe("editChecklistItem",(function(t,n){var e,o;e=n.identifier,o=n.newName,N(e).itemName=o})),B().subscribe("changeItemStatus",(function(t,n){var e,o;e=n.uniqueId,o=n.newStatus,N(e).itemStatus=o})),B().subscribe("removeChecklistItem",(function(t,n){!function(t){x.splice(x.indexOf(N(t)),1)}(n)})),B().subscribe("reloadChecklist",(function(t,n){E(n)})),B().subscribe("clearChecklist",(function(t,n){x=[]}));let ot=function(){const t=[];for(let n=0;n<localStorage.length;n++){const e=localStorage.key(n);t.push({projectName:e,lastUpdated:k(e).lastUpdated,projectTodos:k(e).listOfTodos})}return t.sort(((t,n)=>t.lastUpdated>n.lastUpdated?1:-1))}();function it(){return ot}0===ot.length?H("Default"):ot.forEach((t=>{H(t.projectName)})),ot=[],function(){const t=document.getElementById("plus"),n=document.querySelector("dialog:has(.new-project-input-dialog)"),e=document.getElementById("input-field-project-name"),o=document.getElementById("add-button"),i=document.getElementById("close-new-project-input-dialog-btn");function A(){""!==e.value?(H(e.value),r()):alert("Project name cannot be empty!")}function r(){n.close(),e.value=""}t.addEventListener("click",(t=>{n.showModal()})),o.addEventListener("click",A),e.addEventListener("keydown",(t=>{"Enter"===t.key&&A()})),i.addEventListener("click",(t=>{r()})),n.addEventListener("keydown",(t=>{"Escape"===t.key&&r()}))}()}},t=>{t.O(0,[96],(()=>(836,t(t.s=836)))),t.O()}]);
//# sourceMappingURL=main.2855fc54a95c366d9fed.js.map