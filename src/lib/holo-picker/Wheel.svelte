<script lang="ts">
	import { afterUpdate, createEventDispatcher, onMount } from 'svelte';

	const dispatch = createEventDispatcher();

	export let selected;
	export let data = 0;
	export let type;
	export let height: number = 56;

	let position = selected ? -(selected - 1) * height : 0;
	let offset = 0;
	let dragging = false;

	let itemWrapper, previousY;

	onMount(() => {
		setPosition();
	});

	afterUpdate(() => {
		let selectedPosition = -(selected - 1) * height;

		if (!dragging && position !== selectedPosition) {
			position = selectedPosition;
			setPosition();
		}
	});

	function onDateChange(type, changedData) {
		console.log('onDateChange', type, changedData);
		dispatch('dateChange', {
			type,
			changedData
		});
	}

	function setPosition() {
		let itemPosition = `
        will-change: 'transform';
        transition: transform ${(Math.abs(offset) / height) * 2 + 0.1}s;
        transform: translateY(${position}px)
      `;
		itemWrapper.style.cssText = itemPosition;
	}

	let onMouseDown = (event) => {
		previousY = event.touches ? event.touches[0].clientY : event.clientY;
		dragging = true;

		window.addEventListener('mousemove', onMouseMove);
		window.addEventListener('mouseup', onMouseUp);
		window.addEventListener('touchmove', onMouseMove);
		window.addEventListener('touchend', onMouseUp);
	};

	let onMouseMove = (event) => {
		let clientY = event.touches ? event.touches[0].clientY : event.clientY;
		offset = clientY - previousY;

		let maxPosition = -data.length * height;
		let _position = position + offset;
		position = Math.max(maxPosition, Math.min(height, _position));
		previousY = event.touches ? event.touches[0].clientY : event.clientY;
		setPosition();
	};

	let onMouseUp = () => {
		let maxPosition = -(data.length - 1) * height;
		let rounderPosition = Math.round((position + offset * 5) / height) * height;
		let finalPosition = Math.max(maxPosition, Math.min(0, rounderPosition));

		dragging = false;
		position = finalPosition;

		window.removeEventListener('mousemove', onMouseMove);
		window.removeEventListener('mouseup', onMouseUp);
		window.removeEventListener('touchmove', onMouseMove);
		window.removeEventListener('touchend', onMouseUp);

		setPosition();
		onDateChange(type, -finalPosition / height);
	};

	let onWheel = (e) => {
		if (e.deltaY < 0) {
			position = position - height;
		}
		if (e.deltaY > 0) {
			position = position + height;
		}
		onMouseUp();
	};
</script>

<div
	class="h-14 w-full border-b border-t border-base-300"
	on:mousedown={onMouseDown}
	on:touchstart={onMouseDown}
	on:wheel={onWheel}
>
	<ul bind:this={itemWrapper}>
		{#each data as item}
			<li class="wheel flex text-center items-center justify-center h-14 w-full">{item}</li>
		{/each}
	</ul>
</div>
