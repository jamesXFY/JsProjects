///<summary>
/// Dynamic navigation tree to display content of a truii library. 
/// Multiple options available (e.g. show/hide checkboxes for file batch select)
///</summary>
var NavTree = function (args) {

    if (window === this) {  // making sure we don't have the wrong this reference when instanciating
        return new NavTree(args);
    }

    if (!args || args.treeControlId == null || args.prefix == null || args.getInitialDataRequest == null || args.getItemsRequest == null) //&& !!!args.onFolderClick && !!!args.onProfileClick && !!!args.onFileClick
        throw "null arguments exception";
     
    // setting private members
    this._treeControlId = args.treeControlId;
    this._prefix = args.prefix;
    this._getInitialDataRequest = args.getInitialDataRequest; 
    this._getItemsRequest = args.getItemsRequest;
    this._onFileClick = args.onFileClick;
    this._onFolderClick = args.onFolderClick;
    this._onProfileClick = args.onProfileClick;
    this._onTreeNodeActivate = args.onTreeNodeActivate;
    this._onAfterInitialDataLoaded = args.onInit;
    this._selectedNodes = {};
    this._isCheckBox = (args.checkbox == null ? false : args.checkbox);
    this._canUnselectNodes = (args.canUnselectNodes != null ? args.canUnselectNodes : false); // can unselect by clicking on node instead of activation
     
    this.initialise();
    return this;
}
 
///<summary>
/// Dynamic navigation tree prototype methods
///</summary>
NavTree.prototype = {
    ///<summary>
    /// Tree view initialisation will make a call to the initial data request to initialise the default treeview content
    ///</summary>
    initialise: function () {
        var o = this;
        o._getInitialDataRequest().done(
            function (data) {
                o.onInitDataLoaded(data);
            });
    },


    setIconUrl: function (d) {
        d.icon = truiiTools.getIconUrl(d.icon);
        if (d.thumbnail)
            d.thumbnail = truiiTools.getThumbnail(d.thumbnail);
        if (d.children != null && d.children.length > 0)
            d.children.forEach(truiiNavTree.setIconUrl);
    },

    ///<summary>
    ///  
    ///</summary>
    ///  <param name="data"> </param>
    onInitDataLoaded: function (data) {
        var o = this;
        o.convertDTO(data);
        //console.log(data);


        $(o._treeControlId).fancytree({
            tabindex: "",
            extensions: ["persist"],
            source: data,
            imagePath: "",
            checkbox: o._isCheckBox,
            selectMode: 3,
            idPrefix: o._prefix,
            generateIds: true,
            // clickFolderMode: 2,
            persist: {
                expandLazy: false,
                overrideSource: false, // true: cookie takes precedence over `source` data attributes.
                store: "auto" // 'cookie', 'local': use localStore, 'session': sessionStore
            },
            expand: function (event, data) {
                //  console.log("expand"); return false;
                // console.log(event, data);
            },
            collapse: function (event, data) {
                //  console.log("collapse"); return false;
            },
            click: function (event, data) {
                o.onTreeNodeClick(event, data);
                return false;
            },
            activate: function (event, data) {
                o.onTreeNodeActivate(event, data);
            },
            lazyLoad: function (event, data) {

                var dfd = new $.Deferred();
                data.result = dfd.promise();

                o._getItemsRequest(data.node.data.id).
                    done(function (rData) {
                        o.onLazyLoadDataReceived(dfd, rData, data);
                    });
            }
        });

        if (!!o._onAfterInitialDataLoaded)
            o._onAfterInitialDataLoaded();
    },

    ///<summary>
    ///  
    ///</summary>
    ///  <param name=""> </param>
    ///  <param name=""> </param>
    getSelectedNodes: function () {
        var o = this;
        var selectedNodes = $(o._treeControlId).fancytree('getTree').getSelectedNodes();
        return selectedNodes;
    },

    getSelectedFolders: function () {
        var o = this;
        var selectedNodes = $(o._treeControlId).fancytree('getTree').getSelectedNodes();
        if (!selectedNodes)
            return null;

        var folders = [];
        selectedNodes.forEach(function (node) {
            if (node.folder)
                folders.push(node);
        });

        return folders;
    },

    getSelectedFiles: function () {
        var o = this;
        var selectedNodes = $(o._treeControlId).fancytree('getTree').getSelectedNodes();
        if (!selectedNodes)
            return null;

        var files = [];
        selectedNodes.forEach(function (node) {
            if (!node.folder)
                files.push(node);
        });

        return files;
    },

    ///<summary>
    ///  
    ///</summary>
    ///  <param name=""> </param>
    ///  <param name=""> </param>
    onLazyLoadDataReceived: function (dfd, data, arg) {
        var o = this;
        if (data != null && data !== "") {
            o.convertDTO(data);
            // console.log(data);
            // console.log(dfd);
            for (var i = 0; i < data.length; i++) {
                var node = data[i];
                var nodeId = node.key;
                if (o._selectedNodes["" + nodeId] != null)
                    node.selected = o._selectedNodes["" + nodeId];
                /*else {
                    if (o._canUnselectNodes && o._isCheckBox) {
                        node.selected = arg.node.selected;
                        // if (node.selected)
                        //    node.expanded = true;
                    }
                }*/
            }
            dfd.resolve(data);

            if (o._canUnselectNodes && o._isCheckBox) {
                if (arg.node.selected) {
                    for (var i = 0; i < data.length; i++) {
                        var node = data[i];
                        var key = node.key;
                        o.setNodeSelection(key, true);
                        o.setNodeExpand(key);
                    }
                }

                // node.selected = arg.node.selected;
                // if (node.selected)
                //    node.expanded = true;
            }
        }
    },

    ///<summary>
    ///  
    ///</summary>
    ///  <param name=""> </param>
    convertDTO: function (data) {
        var o = this;

        data.forEach(o.setIconUrl);
        for (var i = 0; i < data.length; i++) {
            o.convertDTOForItem(data[i]);
            if (data[i].children != null) 
                o.convertDTO(data[i].children);
        }
    },

    ///<summary>
    ///  
    ///</summary>
    ///  <param name=""> </param>
    convertDTOForItem: function (item) {
        var o = this;
        if (item.IsExpanded != null) item.expanded = JSON.parse(item.IsExpanded);
        if (item.IsFavorite != null) item.favorite = JSON.parse(item.IsFavorite);
        if (item.IsFolder != null) item.folder = JSON.parse(item.IsFolder);
        if (item.IsLazy != null) item.lazy = JSON.parse(item.IsLazy);
        if (item.IsSelected != null) item.selected = JSON.parse(item.IsSelected);
        if (item.IsVisible != null) item.visible = JSON.parse(item.IsVisible);
    },

    ///<summary>
    ///  
    ///</summary>
    ///  <param name=""> </param>
    ///  <param name=""> </param>
    onTreeNodeActivate: function (event, data) {
        var o = this;
        if (data.originalEvent && !!o._onTreeNodeActivate)
            o._onTreeNodeActivate(event, data);

    },

    ///<summary>
    ///  
    ///</summary>
    ///  <param name=""> </param>
    ///  <param name=""> </param>
    onTreeNodeClick: function (event, data) {
        var o = this;
        if (event.targetType == "expander")
            return false;

        var node = data.node;
        var key = node.key;

        if (key == "home") {
            if (o._onProfileClick != null)
                o._onProfileClick();
        }
        else if (key == "favs") { // nothing needed here
        }
        else if (node.data != null) {
            var id = node.data.id;
            if ($(event.toElement).hasClass('fancytree-checkbox')) {//fancytree-expander
                if (!node.folder) {
                    if (o._canUnselectNodes) {
                        o.setNodeSelection("file" + node.data.id, !node.selected);
                    }
                } else {
                    if (o._canUnselectNodes) {
                        if (node.lazy == true && node.children == null) {
                            o.setNodeSelection("folder" + node.data.id, !node.selected);
                            node.setExpanded(true);
                        }
                        else {
                            // node.setSelected(!node.selected);
                            if (node.children != null) {
                                var selected = node.selected;
                                node.setExpanded(!selected);
                                for (var i = 0; i < node.children.length; i++) {
                                    node.children[i].setSelected(!selected);
                                    node.children[i].setExpanded(!selected);
                                }
                            }
                        }
                    }
            }

                /*if (o._canUnselectNodes) {
                    node.setExpanded(true);
                }*/
            } else {
                node.setExpanded(!node.isExpanded());
            }

            if (node.folder && node._isLoading == false) {
                if (o._onFolderClick != null)
                    o._onFolderClick(id, node);
            }
            else {
                // propagate the event to the attached handler
                if (!!o._onFileClick)
                    o._onFileClick(id, node);
                 
            }
        }
    },
 

    ///<summary>
    ///  
    ///</summary>
    ///  <param name=""> </param>
    activateKey: function (nodeKey) {
        var o = this;
        $(o._treeControlId).fancytree("getTree").activateKey(nodeKey); // activate the tree node
    },

    ///<summary>
    ///  
    ///</summary>
    ///  <param name=""> </param>
    clearTreeSelection: function () {
        var o = this;
        // clear previous tree selection / highlighted node
        try {
            $(o._treeControlId).fancytree("getTree").activateKey("");
            $(o._treeControlId).fancytree("getTree").setFocus(false);
        } catch (e) {
            // catch exception if the tree isn't initialized when the 'setCurrentView' method is called
        }
    },

    ///<summary>
    ///  
    ///</summary>
    /// <returns> </returns>
    getRoot: function () {
        var o = this;
        var rootNode = $(o._treeControlId).fancytree("getRootNode");
        return rootNode;
    },

    ///<summary>
    ///  
    ///</summary>
    ///  <param name=""> </param>
    getNode: function (key) {
        var o = this;
        var ctrl = $(o._treeControlId);
        var node = ctrl.fancytree("getTree").getNodeByKey(key);
        return node;
    },

    ///<summary>
    ///  
    ///</summary>
    ///  <param name=""> </param>
    removeNode: function (key) {
        var o = this;
        var node = o.getNode(key);
        if (node != null)
            node.remove();
    },

    ///<summary>
    ///  
    ///</summary>
    ///  <param name=""> </param>
    ///  <param name=""> </param>
    removeNodeFrom: function (root, key) {
        var o = this;
        for (var i = 0; i < root.children.length; i++) {
            var node = root.children[i];
            if (node.key == key) {
                node.remove();
                i--;
                return;
            }
        }
    },

    ///<summary>
    ///  
    ///</summary>
    ///  <param name=""> </param>
    ///  <param name=""> </param>
    editNodeName: function (key, title) {
        var o = this;
        var node = o.getNode(key);
        if (node != null)
            node.setTitle(title);
    },

    ///<summary>
    ///  
    ///</summary>
    ///  <param name=""> </param>
    removeFile: function (fileId) {
        var o = this;
        o.removeNode("file" + fileId);
    },

    ///<summary>
    ///  
    ///</summary>
    ///  <param name=""> </param>
    removeFolder: function (folderId) {
        var o = this;
        o.removeNode(folderId);
    },

    ///<summary>
    ///  
    ///</summary>
    ///  <param name=""> </param>
    ///  <param name=""> </param>
    editFileName: function (fileId, title) {
        var o = this;
        o.editNodeName("file" + fileId, title);
    },

    ///<summary>
    ///  
    ///</summary>
    ///  <param name=""> </param>
    ///  <param name=""> </param>
    editFolderName: function (folderId, title) {
        var o = this;
        o.editNodeName("folder" + folderId, title);
    },

    ///<summary>
    ///  
    ///</summary>
    ///  <param name="args"> title, id, key, isFolder, icon, tooltip, isVisible, lazyLoad </param>
    createNode: function (args) {
        var o = this;
        var node = {
            id: args.id,
            title: args.title || "Title",
            key: args.key,
            folder: args.isFolder,
            icon: icon,
            tooltip: args.tooltip || "",
            class: (args.isVisible != null && !args.isVisible ? 'truii-hidden' : ''),
            lazyLoad: args.lazyLoad || false
        };
        return node;
    },

    ///<summary>
    ///  
    ///</summary>
    ///  <param name=""> </param>
    ///  <param name=""> </param>
    ///  <param name=""> </param>
    addFolderTo: function (root, name, id) {
        var o = this;
        var node = o.createNode({
            title: name,
            id: id,
            key: "folder" + id,
            isFolder: true,
            icon: "/images/file-icons/folder.png",
            lazyLoad: true
        });

        root.addChildren(node);
    },

    ///<summary>
    ///  
    ///</summary>
    ///  <param name=""> </param>
    ///  <param name=""> </param>
    addLibrary: function (name, id) {
        var o = this;
        var rootNode = o.getRoot(o._treeControlId);
        var node = o.createNode({
            title: name,
            id: id,
            key: "folder" + id,
            isFolder: true,
            icon: "/images/icons/library-owner.png",
            lazyLoad: true
        });

        rootNode.addChildren(node);
    },

    ///<summary>
    ///  
    ///</summary>
    ///  <param name=""> </param>
    removeLibrary: function (id) {
        var o = this;
        o.removeFolder("folder" + id);
    },

    ///<summary>
    ///  
    ///</summary>
    ///  <param name=""> </param>
    removeContentInFolder: function (id) {
        var o = this;
        var root = o.getNode("folder" + id);
        if (root.children == null)
            return;

        for (var i = 0; i < root.children.length; i++) {
            var node = root.children[i];
            node.remove();
            i--;

            if (root.children == null)
                break;
        }
    },

    ///<summary>
    ///  
    ///</summary>
    ///  <param name="root"> fancytree node</param>
    ///  <param name="tvn"> TreeViewNode settings</param>
    ///  <param name="expand"> </param>
    addNodeTo: function (root, tvn, expand) {
        // get the root node
        //var root = truiiNavTree.getNode("folder" + destination);

        var o = this;
        if (tvn.folder) {
            // add the folder
            var node = o.createNode({
                title: tvn.title,
                id: tvn.id,
                key: "folder" + tvn.id,
                isFolder: true,
                icon: tvn.icon
            });

            if (expand != null && expand == true)
                node.expanded = true;

            var child = root.addChildren(node);

            // add the children (subfolders and files)
            for (var i = 0; i < tvn.children.length; i++) {
                o.addNodeTo(child, tvn.children[i]);
            }
        }
        else {
            // add the file  
            var node = o.createNode({
                title: tvn.title,
                id: tvn.id,
                key: "file" + tvn.id,
                isFolder: false,
                icon: tvn.icon,
                isVisible: tvn.isVisible
            });

            root.addChildren(node);
        }
    },

    ///<summary>
    ///  
    ///</summary>
    ///  <param name=""> </param>
    ///  <param name=""> </param>
    moveNodeTo: function (nodeKey, destinationNode) {
        var o = this;
        var node = o.getNode(nodeKey);
        if (node != null)
            node.moveTo(destinationNode, 'child');
    },

    ///<summary>
    ///  
    ///</summary>
    ///  <param name=""> </param>
    ///  <param name=""> </param>
    setNodeSelection: function (nodeId, isSelected) {
        var o = this;
        var node = o.getNode(nodeId);
        if (node != null) {
            node.setSelected(isSelected);
        }
        o._selectedNodes["" + nodeId] = isSelected;
    },

    setNodeExpand: function(nodeId, isExpanded) {
        var o = this;
        var node = o.getNode(nodeId);
        if (node != null) {
            node.setExpanded(isExpanded);
        }
    },

    ///<summary>
    ///  
    ///</summary>
    ///  <param name=""> </param>
    ///  <param name=""> </param>
    ///  <param name=""> </param>
    batchMove: function (folders, files, destination) {
        var o = this;
        var newRoot = o.getNode("folder" + destination);
        for (var i = 0 ; i < files.length; i++) { // move the file nodes
            o.moveNodeTo("file" + files[i], newRoot);
        }
        for (var i = 0 ; i < folders.length; i++) { // move the folder nodes
            o.moveNodeTo("folder" + folders[i], newRoot);
        }
        newRoot.sortChildren();
    },

    ///<summary>
    ///  
    ///</summary>
    ///  <param name=""> </param>
    ///  <param name=""> </param>
    batchMoveFiles: function (files, destination) {

        var o = this;
        var newRoot = o.getNode("folder" + destination);
        newRoot.expanded = true;

        for (var i = 0 ; i < files.length; i++) { // move the file nodes

            if (files[i].type == "folder")
                continue;

            var node = o.getNode("file" + files[i].id);
            if (node == null)
                continue;

            node.title = files[i].title;

            o.moveNodeTo("file" + files[i].id, newRoot);
        }

        newRoot.sortChildren();
    },

    ///<summary>
    ///  
    ///</summary>
    ///  <param name=""> </param>
    ///  <param name=""> </param>
    batchMoveFolders: function (folders, destination) {
        var o = this;

        var newRoot = o.getNode("folder" + destination);
        newRoot.expanded = true;

        for (var i = 0 ; i < folders.length; i++) { // move the file nodes

            if (folders[i].type != "Folder")
                continue;

            var node = o.getNode("folder" + folders[i].id);
            if (node == null)
                continue;

            node.title = folders[i].title;

            o.moveNodeTo("folder" + folders[i].id, newRoot);
        }

        newRoot.sortChildren();
    },

    ///<summary>
    ///  
    ///</summary>
    ///  <param name="id"> </param>
    refreshFolder: function (id) {
        var o = this;
        var root = o.getNode("folder" + id);

        truiiWCF.getFolderContentWithOptions({
            folderId: folderId,
            filterBy: "*",
            includeSubFolders: true
        }).done(function (setup) {

            if (setup == null || setup.length == 0)
                return;

            o.removeContentInFolder(folderId);

            root.expanded = true;
            for (var i = 0; i < setup.length; i++) {
                o.addNodeTo(root, setup[i]);
            }
        });
    },

    ///<summary>
    /// Get the  nodes matching the given condition
    ///</summary>
    ///  <param name="node">Node to get the files from</param> 
    ///  <param name="isRecursive">Boolean indicating if the search goes into subfolders</param> 
    ///  <param name="match">Delegate method used to select relevant nodes</param>
    ///  <returns>List of nodes matching the condition</returns>
    findNodes: function (node, isRecursive, match)
    {
        var o = this;
        var list = new Array();

        if (match(node))
            list.push(node);

        if (isRecursive && node.children != null) {
            node.children.forEach(function (child) {
                var sub = o.findNodes(child, isRecursive, match);
                sub.forEach(function (element) {
                    list.push(element);
                });
            });
        }
        
        return list;
    },

    ///<summary>
    /// Get the list of all files selected in the treeview
    ///</summary>
    ///  <returns>List of selected file ids</returns>
    findAllSelectedFileNodes: function () {
        var o = this;
        var rootNode = o.getRoot();
        var match = function (node) {
            return (node.folder != null && !node.folder && node.selected == true); // match confition: we only want selected files
        }
        return o.findNodes(rootNode, true, match);
    } 
     
}