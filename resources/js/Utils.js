//sendJsonRequest
//sendJsonForm
//loadCSVasObj
//loadCSVasArray

/**
 * 
 * @param {String} url 
 * @param {String} type 
 * @param {object} data 
 * @param {(status:string,res:object)=>void} responseCallback 
 */
function sendJsonRequest(url, type, data, responseCallback)
{
	var xhr = new XMLHttpRequest();
	xhr.open(type, url, true);
	xhr.setRequestHeader("Content-Type", "application/json");
	xhr.onreadystatechange = function () 
	{
		if (xhr.readyState === 4) 
		{
			var json = JSON.parse(xhr.responseText);
			responseCallback(xhr.status, json);
		}
	};
	if(data != null)
	{
		var jsonData = JSON.stringify(data);
		xhr.send(jsonData);
	}
	else
		xhr.send();
}


function loadCSVasObj(csv, numberOfColumns)
{
	var lines=csv.split("\n");
	var result = [];
	var headers = 0;
	var delimiter = "";
	
	if(lines[0].split(",").length == numberOfColumns)
		delimiter = ","
	else if(lines[0].split(";").length == numberOfColumns)
		delimiter = ";"
	else
		return null;
	
	headers = lines[0].split(delimiter);

	for(var i=1;i<lines.length;i++)
	{

		var obj = {};
		var currentline=lines[i].split(delimiter);

		if(currentline.length == numberOfColumns)
		{
			for(var j=0;j<headers.length;j++)
			{
				obj[headers[j]] = currentline[j].trim();
			}

			result.push(obj);
		}
	}
  
  return result;
}


function loadCSVasArray(csv, numberOfColumns)
{
	var lines=csv.split("\n");
	var result = [];
	var headers = 0;
	var delimiter = "";
	
	if(lines[0].split(",").length == numberOfColumns)
		delimiter = ","
	else if(lines[0].split(";").length == numberOfColumns)
		delimiter = ";"
	else
		return null;
	
	headers = lines[0].split(delimiter);

	for(var i=1;i<lines.length;i++)
	{

		var obj = [];
		var currentline=lines[i].split(delimiter);

		if(currentline.length == numberOfColumns)
		{
			for(var j=0;j<headers.length;j++)
			{
				obj[j] = currentline[j].trim();
			}

			result.push(obj);
		}
	}
  
  return result;
}


function sendJsonForm(url, formParent, responseCallback)
{
	let data = {};
	
	for(let i=0;i<formParent.elements.length;i++)
	{
		if(formParent.elements[i].type != "button" && formParent.elements[i].type != "submit" &&  !formParent.elements[i].disabled)
		{
			let name = formParent.elements[i].id;
			let value = formParent.elements[i].type == "radio" || formParent.elements[i].type == "checkbox" ? formParent.elements[i].checked : formParent.elements[i].value;
			data[name] = value;
		}
	}
	
	sendJsonRequest(url, "POST", data, responseCallback);
}


function createPieChart(parent, data, colors)
{
	var chartElements = parent.getElementsByClassName("pieChartElement");
				console.log("lol")
	for(var i=0;i<chartElements.length;i++)
	{
		chartElements[i].addEventListener("mousemove", function(event)
		{
			console.log("lol")
			console.log(event.clientX);
		});
	}
}