var Webflow = Webflow || [];
Webflow.push(function () {

	window.TEMPLATE = null;
	window.ANGLE_TEMPLATE = null;
	getObjectFromTemplate();
	cleanProjects();

	let attempts = 0;
	const maxAttempts = 50;
	
	const intervalId = setInterval(() => {
		if (typeof EMAIL !== 'undefined' && EMAIL !== '') {
			clearInterval(intervalId);
			loadProjects();
			return;
		}
		
		attempts++;
		if (attempts >= maxAttempts) {
			clearInterval(intervalId);
			return
		}
	}, 100);
	
	function buildPath(project_id, angle_id, ad_id) {
		return `${CURRENT_DOMAIN}/members/project-page?project_id=${project_id}&angle_id=${angle_id}&ad_id=${ad_id}`;
	}
	
	function getObjectFromTemplate() {
		if (window.TEMPLATE !== null) {
			return window.TEMPLATE.cloneNode(true);
		}
		
		const templateObject = document.querySelector('[data-selector="template-item"]');
		if (!templateObject) {
			console.err('Error getting the template')
		}

		window.ANGLE_TEMPLATE = templateObject.querySelector('[data-selector="angle-item-container"]');	
		
		templateObject.querySelector('[data-selector="angle-item-container"]').remove();
		window.TEMPLATE = templateObject;
		return window.TEMPLATE.cloneNode(true);
	}
	
	function getAngleObjectFromTemplate() {
		if (window.ANGLE_TEMPLATE !== null) {
			return window.ANGLE_TEMPLATE.cloneNode(true);
		}

		getObjectFromTemplate();
		return window.ANGLE_TEMPLATE.cloneNode(true);
	}
	
	function buildAngleItem(angleItem, angleLink) {
		const node = getAngleObjectFromTemplate();
		
		const angleItemNameSelector ='.angle-item-name';
		const angleDraftAmountSelector ='.angle-item-daf';
		const angleLinkSelector ='.angle-item-link';

		node.querySelector(angleItemNameSelector).text = angleItem.name;
		node.querySelector(angleDraftAmountSelector).innerHTML = `(${angleItem.draft_count})`;
		node.querySelector(angleLinkSelector).href = angleLink;

		return node;
	}
	
	function buildAndAppendProject(item) {
		const projectItem = getObjectFromTemplate();
		
		const titleSelector = '[data-selector="item-project-name"]';
		projectItem.querySelector(titleSelector).textContent = item.name; 
		
		const angleContainerSelector = '.angles-container';
		item.angles.forEach( (angleItem) => {
			const link = buildPath(item.project_id, angleItem.angle_id, item.ad_id);
			const builtAngle = buildAngleItem(angleItem, link);
			projectItem.querySelector(angleContainerSelector).appendChild(builtAngle);
		});
		
		const containerSelector = ".project-list-container";
		const container = document.querySelector(containerSelector);
		container.appendChild(projectItem);
	}
	
	function cleanProjects() {
		document.querySelector(".project-list-container").innerHTML = "";
	}

	function loadProjects() {
		const formMethod = "GET";
		const formAction = BASE_ENDPOINT + "/users/projects?user_email=" + EMAIL;

		endpoint = formAction;

		$.ajax({
			method: formMethod,
			url: endpoint,
			contentType: "application/json; charset=utf-8",
			dataType: "json",
		})
		.done((res) => {
			res.projects.forEach( (item) => {
				buildAndAppendProject(item);
			})
			
		}).fail((res) => {
			alert(res);
		});
	}
});
