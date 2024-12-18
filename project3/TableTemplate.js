'use strict';
class TableTemplate {

	static fillIn(id, obj, colName) {
		const table = document.getElementById(id);
		const colIdx = TableTemplate.findColumn(table, obj, colName);

		console.log(colIdx);
		//colName baihgui bol;
		if(!colName) {
			TableTemplate.fillAllColumn(table, obj);
			// return;
		}

		else if(colIdx !== -1){
			TableTemplate.fillColumn(table, colIdx, obj);
		}

		table.style.visibility = 'visible';
	}

	static fillColumn(table, idx, obj) {
		
		for(let i = 1; i < table.rows.length; i++) {
			const cell = table.rows[i].cells[idx];
			const temp = new Cs142TemplateProcessor(cell.innerHTML);

			cell.innerHTML = temp.fillIn(obj);
		}
	}

	static fillAllColumn(table, obj)  {
		const len = table.rows[0].cells.length;

		// let t = table.innerHTML;
		// let temp = new Cs142TemplateProcessor(t);
		// t = temp.fillIn(obj);
		// table.innerHTML = t;

		for(let i = 0; i < len; i++) {
			TableTemplate.fillColumn(table, i, obj);
		}
	}

	static findColumn(table, obj, colName) {
		const colNames = table.rows[0].cells;
		let colIdx = -1;
		
		for(let i = 0; i < colNames.length; i++) {
			const temp = new Cs142TemplateProcessor(colNames[i].innerHTML);
			colNames[i].innerHTML = temp.fillIn(obj);

			if(colName && colNames[i].innerHTML === colName) colIdx = i;
		}
		return colIdx;
	}
}