'use strict';

class AdTypes {
	static getInstance() {
		if (!AdTypes.instance) {
			AdTypes.instance = new AdTypes();
		}

		return AdTypes.instance;
	}
	getAdTypes () {
		return ['ad', 'introad', 'stickyad'];
	}
}

export default AdTypes;