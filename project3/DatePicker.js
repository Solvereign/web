'use strict';

class DatePicker {
	
	constructor(id, func)  {
		this.id = id;
		this.callback = func;
		this.me = document.getElementById(id);
		// this.fixedDate = {year:0, month:0, day:0} -> songogdson ognoo
		// this.currentDate -> ali oni ali sarig haruulj baigaa we
	}

	// ene func busdigaa ashigladag.
	render(date) {

		// huuchin calendarig ustgah uildeh?
		if(this.me.firstChild) this.me.removeChild(this.me.firstChild);

		const obj = {year: 0, month: 0, day: 0};
		obj.year = date.getFullYear();
		obj.month = date.getMonth()+1;
		obj.day = date.getDate();
		// console.log(obj);
		//currentDate ashiglan sar hoorond shiljine
		//fixedDate ni songogdson udur
		// er ni currentDate-n hereg bnu
		this.currentDate = date;
		if(typeof this.fixedDate === 'undefined'){
			this.fixedDate = obj;
			this.callback(this.id, this.fixedDate);
		} 

		const calendar = this.createCalendar(date);
		this.me.appendChild(calendar);

	}

	// calendar uusgeh
	// fixed date ni selected
	// currendDate ni tuhain sarig olohod tusalna
		// sar soligdohod currentDate-g solino.
	createCalendar(date) {
		const calendar = document.createElement("DIV");
		calendar.classList.add('calendar');

		calendar.appendChild(this.createHeader(date));
		calendar.appendChild(this.createTable(date));

		return calendar;
	}
	// calendarin deed heseg buyu 2 towch, text-g uusgeh
	createHeader(date) {
		const header = document.createElement('DIV');
		header.classList.add('calendarHeader');

		header.appendChild(this.createButton('left'));
		header.appendChild(DatePicker.createText(date));
		header.appendChild(this.createButton('right'));

		return header;
	}

	// zuun bolon baruun tiish hudluh <, > towchnuud
	createButton(id) {
		const btn = document.createElement('button');
		btn.classList.add('calendarButton');
		btn.id = id;
		// btn.picker = this;
		// end odoo eventListener dutuu
		if(id === 'left'){
			btn.append('<');
			// btn.addEventListener('click', this.changeMonth()
			btn.addEventListener('click', () => {this.changeMonth(-1);});
		}
		else {
			btn.append('>');
			btn.addEventListener('click', () => {this.changeMonth(1);});

		}

		return btn;

	}
	// sar, onig haruulna
	static createText(date) {
		const elm = document.createElement('SPAN');
		elm.classList.add('calendarMonthYear');

		const months = ['January', 'February', 'March', 'April', 'May', 'June',
					'July', 'August', 'September', 'October', 'November', 'December'];

		const str = months[date.getMonth()] + ' ' + date.getFullYear(); 
		elm.append(str);

		return elm;
		
	}
	// husnegtiig buheld ni uusgeh
	createTable(date) {
		const table = document.createElement('TABLE');
		table.classList.add('calendarBody');

		table.append(DatePicker.createTableHead());
		table.append(this.createTableBody(date));

		return table;
	}

	static createTableHead() {
		const wdays = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

		const thead = document.createElement('THEAD');
		thead.classList.add('weekdaysHead');
		const tr = document.createElement('TR');

		for(const i of wdays){

			const th = document.createElement('TH');
			th.classList.add('weekdaysName');

			th.append(i);
			tr.appendChild(th);
		}

		thead.appendChild(tr);

		return thead;
	}

	createTableBody(date) {
		const body = document.createElement('TBODY');
		body.classList.add('tbody');
		let row = document.createElement('TR');
		
		const beforeMonth = this.offMonthDays(date, 'before');

		for(const day of beforeMonth ) {
			row.appendChild(day);
		}

		const tempDate = new Date(date);
		tempDate.setDate(1);
		let completed = false;

		while(!completed) {

			let dayType = 'onDay';
			if(tempDate.getFullYear() === this.fixedDate.year &&
				(tempDate.getMonth()+1) === this.fixedDate.month && 
				tempDate.getDate() === this.fixedDate.day) dayType = 'selectedDay';

			const day = this.createTableCell(tempDate, dayType);
			row.appendChild(day);

			if(tempDate.getDay() === 6) {
				body.appendChild(row);
				row = document.createElement('TR');
			}

			tempDate.setDate(tempDate.getDate() + 1);
			if(tempDate.getMonth() !== date.getMonth()) completed = true;
		}

		const afterMonth = this.offMonthDays(date, 'after');

		if(afterMonth.length !== 0) {
			for(const day of afterMonth) row.appendChild(day);
			body.appendChild(row);
		}

		return body;

	}
	
	offMonthDays(date, dir) {
		const days = [];
		const tempDate = new Date(date);
		let count = 0;

		if(dir === 'before') {
			tempDate.setDate(1);
			count = tempDate.getDay();
			tempDate.setDate(0);
			tempDate.setDate(tempDate.getDate() - count+1);
		}
		else {
			tempDate.setMonth(tempDate.getMonth()+1);
			tempDate.setDate(1);
			count = tempDate.getDay();
			count = (7 - count) % 7;
		}

		while(count > 0) {
			const day = this.createTableCell(tempDate, 'offDay');
			days.push(day);

			count--;
			tempDate.setDate(tempDate.getDate()+1);
		}

		return days;
	}
	// tuhain udriig uusgeh -> th 
	createTableCell(date, type) {
		// let day = date.getDate();

		const cell = document.createElement('TD');
		const div = document.createElement('DIV');
		
		cell.picker = this;

		if(type === 'onDay') {
			

			cell.addEventListener('click', function() {
				this.picker.currentDate.setDate(1);
				// (before + n)th child gesen ug.
				let before = this.picker.currentDate.getDay();
				
				let elmF = null;
				console.log(`.tbody :nth-child(${before+this.picker.fixedDate.day})`);

				if(this.picker.fixedDate === this.picker.currentDate.getFullYear() &&
					this.picker.fixedDate === this.picker.currentDate.getMonth()+1 )
					elmF = document.getElementsByClassName("calendarDay");
					console.log("hhe", elmF)
				
				elmF = this.picker.me.getElementsByClassName("calendarDay")[before+this.picker.fixedDate.day-1];

				if(elmF){
					elmF.classList.remove('selectedDay');
					elmF.classList.add('onDay');
					console.log("bruh")
					console.log(elmF)
				}
				
				this.picker.fixedDate.year = this.picker.currentDate.getFullYear();
				this.picker.fixedDate.month = this.picker.currentDate.getMonth()+1;
				this.picker.fixedDate.day = parseInt(this.textContent, 10);

				console.log(`.tbody :nth-child(${before+this.picker.fixedDate.day})`);
				let elm1 = this.picker.me.getElementsByClassName("calendarDay")[before+this.picker.fixedDate.day-1];
				elm1.classList.remove('onDay');
				elm1.classList.add('selectedDay');
				//render hiihgui baih heregtei baina
				this.picker.callback(this.picker.id, this.picker.fixedDate);
				// this.picker.render(this.picker.currentDate);
				
			});
		}
				
		div.classList.add('calendarDay');
		div.classList.add(type);

		div.append(date.getDate());
		cell.appendChild(div);

		return cell;
		
	}

	changeMonth(inc) {
		const tempDate = new Date(this.currentDate);
		tempDate.setMonth(tempDate.getMonth() + inc);

		this.render(tempDate);
	}
}