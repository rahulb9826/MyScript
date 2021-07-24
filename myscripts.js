//$$$
function $$$(attribute)
{
  var value;
  this.val=function(){
    value=document.getElementById(attribute).value;
    return value;
  }
  return this;
}
//$$$.getJSON
$$$.getJSON=function(JSONObject)
{
  if(!JSONObject.url) throw "url property missing in json/url is boolean";
  if(!JSONObject.method) throw "method property missing in json/url is String";
  if(typeof JSONObject.url!="string") throw "url must be of String Type";
  if(typeof JSONObject.method!="string") throw "method must be of String Type";
  if(JSONObject.success && typeof JSONObject.success!="function") throw "success property must be of function type";
  if(JSONObject.failed && typeof JSONObject.failed!="function")throw "failed property shoould represent a function";
  if(JSONObject.data && typeof JSONObject.data!="object") throw "data must be of Object type";
  var xmlHttpRequest=new XMLHttpRequest();
  if(JSONObject.data)
  {
    var url=JSONObject.url+"?";
    for(i in JSONObject.data)
    {
      url=url+i+"="+JSONObject.data[i]+"&";
    }
    url=url.substring(0,url.length-1);
  }
  else {
    var url=JSONObject.url;
  }
  xmlHttpRequest.onreadystatechange=function(){
    if(this.readyState==4)
    {
      if(this.status==200)
      {
        if(JSONObject.success)
        {
          var responseString=xmlHttpRequest.responseText;
          JSONObject.success(responseString);
        }
      }else
      {
        if(JSONObject.failed())
        {
          JSONObject.failed;
        }
      }
    }
  }
  xmlHttpRequest.open(JSONObject.method,url,true);
  if(JSONObject.send) xmlHttpRequest.send(JSONObject.send);
  else xmlHttpRequest.send(null);
}
//$$$.setHTMLModel
function tableObserver(lastEmployees,table,row,rowInnerHTML)
{
var value=row.getAttribute("tm-for");
var variable, dataStructure,index;
index=value.indexOf("in");
variable=value.substring(0,index).trim();
dataStructure=value.substring(index+2).trim();
if(JSON.stringify(lastEmployees)!=JSON.stringify(dataModel[dataStructure]))
{
lastEmployees=JSON.parse(JSON.stringify(dataModel[dataStructure]));
var maleIcon,femaleIcon,deleteIcon,detailsIcon,editIcon;
for(var i=0;i<lastEmployees.length;i++)
{
var addRow=table.insertRow(i+1);
var startIndex=0;
var endIndex=0;
var rowText=rowInnerHTML;
while(1)
{
startIndex=rowText.indexOf("{{{",startIndex+1);
endIndex=rowText.indexOf("}}}",endIndex+1);
if(startIndex==-1) break;
var replacement=rowText.substring(startIndex+3,endIndex).trim();
if(replacement==variable)
{
rowText=rowText.replace("{{{"+replacement+"}}}",i+1);
continue;
}
var dotIndex=replacement.indexOf(".");
if(dotIndex<0)
{
if(replacement=="edit")
{
rowText=rowText.replace("{{{"+replacement+"}}}","<img src='img/edit_icon.png' width='40' height='40'></img>");
}
else if(replacement=="delete")
{
rowText=rowText.replace("{{{"+replacement+"}}}","<img src='img/delete_icon.png' width='40' height='40'></img>");
}
else if(replacement=="details")
{
rowText=rowText.replace("{{{"+replacement+"}}}","<img src='img/details_icon.png' width='40' height='40'></img>");
}
continue;
}


var property=replacement.substring(dotIndex+1);
if(property=="gender")
{
if(dataModel[dataStructure][i][property]=="M")
{
rowText=rowText.replace("{{{"+replacement+"}}}","<img src='img/male_icon.png' width='40' height='40'></img>");
}
else
{
rowText=rowText.replace("{{{"+replacement+"}}}","<img src='img/female_icon.png' width='40' height='40'></img>");
}
}
else
{
rowText=rowText.replace("{{{"+replacement+"}}}",dataModel[dataStructure][i][property]);
}
}
addRow.innerHTML=rowText;
addRow.onclick=createRowClickedHandler(i+1,addRow);
var header=table.rows[0].cells;
for(var a=0; a<header.length; a++)
{
  if(header[a].textContent=="Edit")
  {
    addRow.cells[a].onclick=createEditIconClickedHandler(i+1,addRow);
  }
if(header[a].textContent=="Delete")
  {
    addRow.cells[a].onclick=createDeleteIconClickedHandler(i+1,addRow);
  }
  if(header[a].textContent=="Details")
  {
    addRow.cells[a].onclick=createDetailsIconClickedHandler(i+1,addRow);
  }
}
}
table.deleteRow(table.rows.length-1);
}
setTimeout(tableObserver,100,lastEmployees,table,row,rowInnerHTML);
}
//$$$.setModel
$$$.setModel=function(dataModel)
{
var lastEmployees=[];
var allTags=document.getElementsByTagName("table");
var element;
var tmbind;
for(var i=0;i<allTags.length;i++)
{
for(a in dataModel)
{
if(allTags[i].getAttribute("tm-bind")==a)
{
element=allTags[i];
tmbind=a;
}
}
}
var  rows=element.rows;
var row;
for(var i=0;i<rows.length;i++)
{
if(rows[i].hasAttribute("tm-for"))
{
row=rows[i];
break;
}
}
row.style.display="none";
var rowInnerHTML=row.innerHTML;
tableObserver(lastEmployees,element,row,rowInnerHTML);
}

$$$.checkModel=function(dataModel)
{
  var div=document.getElementsByTagName("div");
  var containers=[];
  for(var i=0; i<div.length-1; i++)
  {
    if(eval("div[i].hasAttribute('model')")) containers.push(div[i]);
  }
  var view=dataModel.model;
  for(i in containers)
  {
    var ee=containers[i].getAttribute('model');
    if(ee.localeCompare(view)==0) containers[i].style.display='block'
    else containers[i].style.display='none'
  }
  setTimeout($$$.checkModel,2000,dataModel);
}
