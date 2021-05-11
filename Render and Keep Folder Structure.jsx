//Add file to the ScriptUI Panels folder

var scriptName = "RenderFolders";
var renderer = "AE";
var dontShowAgain = false;

//UI
var panelGlobal = this;
var dialog = (panelGlobal instanceof Panel) ? panelGlobal : new Window("palette"); 

var AMERender = dialog.add("button", undefined, undefined, {name: "AMERender"}); 
    AMERender.text = "Add to AME Queue"; 
    AMERender.onClick  = function(){
        renderer = "AME";
        getFolders();
}

var renderQueue = dialog.add("button", undefined, undefined, {name: "renderQueue"}); 
    renderQueue.text = "Add to Render Queue"; 
    renderQueue.onClick  = function(){
        renderer = "AE";
        getFolders();
}

dialog.layout.layout(true);
dialog.layout.resize();
dialog.onResizing = dialog.onResize = function () { this.layout.resize(); }

if ( dialog instanceof Window ) dialog.show();



function getFolders() {

    var project = app.project;
    var selectedItems = project.selection;
    var folder;
    var folderNames = [];

    if(selectedItems == ""){
        alert("Please select compositions to render.")
        return false;
    }

    selectFolder();
    
    if (folder == null){
        return false
        }

    for (var i = 0; i < selectedItems.length; i++) {
        if (selectedItems[i] instanceof CompItem) {
            folderNames = [];
            getNames(selectedItems[i]);
            selectedItems[i].folderStructure = folderNames;
            createFolders(selectedItems[i]);
            addToRenderQueue(selectedItems[i], folder.toString() + "/" + selectedItems[i].folderStructure.join("/"));

        }
    }

    if (renderer == "AME"){
        project.renderQueue.showWindow(false);
        queueAME(); 
    }else{
        project.renderQueue.showWindow(true);
    }
     

    function getNames(folderItems) {
        if (folderItems.parentFolder.name != "Root") {
            folderNames.unshift(folderItems.parentFolder.name);
            getNames(folderItems.parentFolder);
        }
    }

    function addToRenderQueue(comp, location) {
        compToRender = project.renderQueue.items.add(comp);
        compToRender.outputModule(1).file = new File(location + "/" + comp.name);
            }

    function queueAME() {
        project.renderQueue.queueInAME(false);
        
        for (var j = 1; j <= project.renderQueue.numItems;) {
            project.renderQueue.items[j].remove()
        }
        
    }

    function createFolders(comp) {
        var createFolder = folder.toString() + "/";

        for (var k = 0; k < comp.folderStructure.length; k++) {
            createFolder += comp.folderStructure[k] + "/";
            if (!(Folder(createFolder).exists)) {
                new Folder(createFolder).create();
            }
        }
    }

    function selectFolder() {

        if (project.file != null) {
            var projectSaveFileLocation = project.file.parent;
        } else {
            var projectSaveFileLocation = Folder.desktop;
        }
        folder = new Folder(projectSaveFileLocation);
        folder = folder.selectDlg("Please pick a folder");
    }

}

