// app.controller('appCtrl', ['$scope', function($scope) {
// 	$scope.jsonToExport = [
//   	{
//     	"col1data": "1",
//       "col2data": "Fight Club",
//       "col3data": "Brad Pitt"
//     },
//   	{
//     	"col1data": "2",
//       "col2data": "Matrix (Series)",
//       "col3data": "Keanu Reeves"
//     },
//   	{
//     	"col1data": "3",
//       "col2data": "V for Vendetta",
//       "col3data": "Hugo Weaving"
//     }
//   ];
  
// 	// Prepare Excel data:
// 	$scope.fileName = "report";
// 	$scope.exportData = [];
//   // Headers:
// 	$scope.exportData.push(["#", "Movie", "Actor"]);
//   // Data:
// 	angular.forEach($scope.jsonToExport, function(value, key) {
//     $scope.exportData.push([value.col1data, value.col2data, value.col3data]);
// 	});
// }]);


/* Directive */
app.directive('excelExport',function (){
      return {
        restrict: 'A',
        scope: {
        	fileName: "@",
					getData: "&",
					//data: "&exportData",
					functions: "="
        },
        replace: true,
        template: '<button class="btn btn-primary btn-ef btn-ef-3 btn-ef-3c mb-10" ng-click="updateData();">Export to Excel <i class="fa fa-download"></i></button>',
        link: function (scope, element, attr) {
					scope.data = [];
					
					scope.updateData=function(){
						scope.getData().then(function(res){
							//data=res;
							var dataObj = [];
							for (var i=1; i<res.length; i++)
							{
								dataObj.push({"date":res[i][0], "our side":res[i][1], "hotel side":res[i][2]});	
							}
							// res.forEach(function(el) {
							// 	dataObj.push({"date":el.billdate._d, "our side":el.ourside, "hotel side":el.hotelside});
							// });
							console.log(res);
							alasql('SELECT * INTO XLSX("john.xlsx",{headers:true}) FROM ?',[dataObj]);
						});

						scope.functions.getData().then(function(res) {
							scope.data=res;
							console.log(res);
							scope.download();
						});
						// scope.$applyAsync(attr.getData);
						// scope.$applyAsync(function(){
						// 	scope.$evalAsync(attr.getData).then(function(data){
						// 			scope.data = data;
						// 			scope.download();
						// 	});
						// });
						
					};
					
					scope.download = function() {

        		function datenum(v, date1904) {
            		if(date1904) v+=1462;
            		var epoch = Date.parse(v);
            		return (epoch - new Date(Date.UTC(1899, 11, 30))) / (24 * 60 * 60 * 1000);
            	}
            	
            	function getSheet(data, opts) {
            		var ws = {};
            		var range = {s: {c:10000000, r:10000000}, e: {c:0, r:0 }};
            		for(var R = 0; R != data.length; ++R) {
            			for(var C = 0; C != data[R].length; ++C) {
            				if(range.s.r > R) range.s.r = R;
            				if(range.s.c > C) range.s.c = C;
            				if(range.e.r < R) range.e.r = R;
            				if(range.e.c < C) range.e.c = C;
            				var cell = {v: data[R][C] };
            				if(cell.v == null) continue;
            				var cell_ref = XLSX.utils.encode_cell({c:C,r:R});
            				
            				if(typeof cell.v === 'number') cell.t = 'n';
            				else if(typeof cell.v === 'boolean') cell.t = 'b';
            				else if(cell.v instanceof Date) {
            					cell.t = 'n'; cell.z = XLSX.SSF._table[14];
            					cell.v = datenum(cell.v);
            				}
            				else cell.t = 's';
            				
            				ws[cell_ref] = cell;
            			}
            		}
            		if(range.s.c < 10000000) ws['!ref'] = XLSX.utils.encode_range(range);
            		return ws;
            	}
            	
            	function Workbook() {
            		if(!(this instanceof Workbook)) return new Workbook();
            		this.SheetNames = [];
            		this.Sheets = {};
            	}
            	 
							var wb = new Workbook();
							var ws = getSheet(scope.data);
            	/* add worksheet to workbook */
            	wb.SheetNames.push(scope.fileName);
            	wb.Sheets[scope.fileName] = ws;
            	var wbout = XLSX.write(wb, {bookType:'xlsx', bookSST:true, type: 'binary'});

            	function s2ab(s) {
            		var buf = new ArrayBuffer(s.length);
            		var view = new Uint8Array(buf);
            		for (var i=0; i!=s.length; ++i) view[i] = s.charCodeAt(i) & 0xFF;
            		return buf;
            	}
            	
        		saveAs(new Blob([s2ab(wbout)],{type:"application/octet-stream"}), scope.fileName+'.xlsx');
        		
        	};
        
        }
      };
    }
 );