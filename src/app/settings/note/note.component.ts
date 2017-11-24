import { Component, OnInit } from '@angular/core';

import {
	NoteService
} from './index';

declare var $: any;

@Component({
	selector: 'app-note',
	templateUrl: './note.component.html',
	styleUrls: ['./note.component.css']
})
export class NoteComponent implements OnInit {

	constructor(
		private noteService: NoteService
		) { }

	ngOnInit() {
		this.styleInputNumber();
	}

	styleInputNumber(): void { 
		$('<div class="quantity-nav"><div class="quantity-button quantity-up">+</div><div class="quantity-button quantity-down">-</div></div>')
		.insertAfter('.quantity input');
		$('.quantity').each(function() {
			let spinner = $(this),
			input = spinner.find('input[type="number"]'),
			btnUp = spinner.find('.quantity-up'),
			btnDown = spinner.find('.quantity-down'),
			min = input.attr('min'),
			max = input.attr('max');

			btnUp.click(function() {
				var oldValue = parseFloat(input.val());
				if (oldValue >= max) {
					var newVal = oldValue;
				} else {
					var newVal = oldValue + 1;
				}
				spinner.find("input").val(newVal);
				spinner.find("input").trigger("change");
			});

			btnDown.click(function() {
				var oldValue = parseFloat(input.val());
				if (oldValue <= min) {
					var newVal = oldValue;
				} else {
					var newVal = oldValue - 1;
				}
				spinner.find("input").val(newVal);
				spinner.find("input").trigger("change");
			});

		});
	}

	setAmountOfRecentNotes(): void {
		this.noteService.recentNotes = $("#recent_note_amount").val();
		localStorage.setItem("recentNotes", $("#recent_note_amount").val());
		this.noteService.renderLastNotesInColumn();
	}

}
