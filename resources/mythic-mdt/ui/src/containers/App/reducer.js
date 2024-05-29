
export const initialState = {
	hidden: process.env.NODE_ENV == 'production',
	//hidden: true,
	opacity: false,
	attorney: false,
	tabletData: process.env.NODE_ENV != 'production' ? {
		links: [
			{
				name: 'home',
				icon: ['fas', 'house'],
				label: 'Home',
				path: '/',
				exact: true,
			},
			{
				name: 'documents',
				icon: ['fas', 'file-lines'],
				label: 'Documents',
				path: '/business/search/document',
				exact: true,
			},
			{
				name: 'receipts',
				icon: ['fas', 'money-check-dollar'],
				label: 'Receipts',
				path: '/business/search/receipt',
				exact: true,
			},
			// {
			// 	name: 'employees',
			// 	icon: ['fas', 'person'],
			// 	label: 'Employees',
			// 	path: '/business/search/documents',
			// 	exact: true,
			// },
			{
				name: 'pdm-stocks',
				icon: ['fas', 'cars'],
				label: 'Vehicle Stock',
				path: '/business/pdm-sales',
				exact: true,
				//permission: 'LOL',
			},
			{
				name: 'pdm-credit-check',
				icon: ['fas', 'magnifying-glass-dollar'],
				label: 'Run Credit Check',
				path: '/business/pdm-credit',
				exact: true,
				//permission: 'LOL',
			},
			{
				name: 'pdm-licence-check',
				icon: ['fas', 'id-card'],
				label: 'Run License Check',
				path: '/business/search/documents',
				exact: true,
			},
			{
				name: 'pdm-manage',
				icon: ['fas', 'list-check'],
				label: 'Manage Dealership',
				path: '/business/pdm-manage',
				exact: true,
			},
			{
				name: 'pdm-history',
				icon: ['fas', 'clock-rotate-left'],
				label: 'Sales History',
				path: '/business/pdm-saleshistory',
				exact: true,
				//permission: 'LOL',
			},
			{
				name: 'dyn8-properties',
				icon: ['fas', 'house-building'],
				label: 'Properties',
				path: '/business/dyn8-properties',
				exact: true,
				//permission: 'LOL',
			},
			{
				name: 'dyn8-credit',
				icon: ['fas', 'magnifying-glass-dollar'],
				label: 'Run Credit Check',
				path: '/business/dyn8-credit',
				exact: true,
				//permission: 'LOL',
			},
		]
	} : null,
	pointBreakpoints: {
		reduction: 25,
		license: 12,
	},
	drafts:
		localStorage.getItem('drafts') != null
			? JSON.parse(localStorage.getItem('drafts'))
			: Array(),
	user: null,
	govJob: null,
	govJobPermissions: null,
	user: process.env.NODE_ENV != 'production' ? {
		MDTSystemAdmin: true,
		_id: '6088b90c93a7b379e0c83ef2',
		SID: 1,
		User: '606c22a749c1c980e8289b35',
		Phone: '121-195-9016',
		Gender: 0,
		Callsign: 400,
		Jobs: [],
		Qualifications: ['fto'],
		Origin: 'United States',
		First: 'Testy',
		Last: 'McTest',
		DOB: '1991-01-01T07:59:59.000Z',
	} : null,
	// govJob: process.env.NODE_ENV != 'production' ? {
	// 	Workplace: {
	// 		Id: 'doj',
	// 		Name: 'Department of Justice',
	// 	},
	// 	Name: 'Government',
	// 	Grade: {
	// 		Id: 'justice',
	// 		Name: 'Justice',
	// 	},
	// 	Id: 'government',
	// } : null ,
	// govJob: process.env.NODE_ENV != 'production' ? {
	// 	Workplace: {
	// 		Id: 'lspd',
	// 		Name: 'Los Santos Police Department',
	// 	},
	// 	Name: 'Police',
	// 	Grade: {
	// 		Id: 'chief',
	// 		Name: 'Chief',
	// 	},
	// 	Id: 'police',
	// } : null,
	// govJob: process.env.NODE_ENV != 'production' ? {
	// 	Workplace: {
	// 		Id: 'safd',
	// 		Name: 'San Andreas Fire & Medical Services',
	// 	},
	// 	Name: 'Medical',
	// 	Grade: {
	// 		Id: 'chief',
	// 		Name: 'Chief',
	// 	},
	// 	Id: 'ems',
	// } : null,
	govJob: process.env.NODE_ENV != 'production' ? {
		Workplace: {
			Id: 'lspd',
			Name: 'Los Santos Police Department',
		},
		Name: 'Police',
		Grade: {
			Id: 'cheif',
			Name: 'Cheif',
		},
		Id: 'police',
	} : null,
	govJobPermissions: process.env.NODE_ENV != 'production' ? {
		ems_alerts: true,
		police_alerts: true,
		police_doors: true,
		ems_doors: true,
		generic_doors: true,
		FLEET_VEHICLES_0: true,
		FLEET_VEHICLES_1: true,
		FLEET_VEHICLES_2: true,
		FLEET_VEHICLES_3: true,
		FLEET_VEHICLES_4: true,
		police_investigation: true,
		leo_hc: true,
		//MDT_INCIDENT_REPORT: true,
	} : null,
	// govJob: process.env.NODE_ENV != 'production' ? {
	// 	// Workplace: {
	// 	// 	Id: 'lspd',
	// 	// 	Name: 'LSPD',
	// 	// },
	// 	Name: 'Premium Deluxe Motors',
	// 	Grade: {
	// 		Id: 'owner',
	// 		Name: 'Owner',
	// 	},
	// 	Id: 'pdm',
	// } : null,
	// govJobPermissions: process.env.NODE_ENV != 'production' ? {
	// 	ems_alerts: true,
	// 	police_alerts: true,
	// 	police_doors: true,
	// 	ems_doors: true,
	// 	generic_doors: true,
	// 	TABLET_CREATE_NOTICE: true,
	// 	TABLET_DELETE_NOTICE: true,
	// 	TABLET_CREATE_DOCUMENT: true,
	// 	TABLET_VIEW_DOCUMENT: true,
	// 	TABLET_PIN_DOCUMENT: true,
	// 	TABLET_DELETE_DOCUMENT: true,
	// 	FLEET_VEHICLES_1: true,
	// 	FLEET_VEHICLES_2: true,
	// 	FLEET_VEHICLES_3: true,
	// 	FLEET_VEHICLES_4: true,
	// 	police_investigation: true,
	// 	leo_hc: true,
	// 	//MDT_INCIDENT_REPORT: true,
	// } : null,
};

const appReducer = (state = initialState, action) => {
	switch (action.type) {
		case 'SET_USER':
			return {
				...state,
				user: {
					...state.user,
					...action.payload.user,
				},
			};
		case 'JOB_LOGIN':
			return {
				...state,
				pointBreakpoints: action.payload.points,
				govJob: action.payload.job,
				govJobPermissions: action.payload.jobPermissions,
				attorney: action.payload.attorney,
				tabletData: action.payload.tabletData,
			};
		case 'JOB_UPDATE':
			return {
				...state,
				pointBreakpoints: action.payload.points
					? action.payload.points
					: state.pointBreakpoints,
				govJob: action.payload.job
					? action.payload.job
					: state.govJob,
				govJobPermissions: action.payload.jobPermissions
					? action.payload.jobPermissions
					: state.govJobPermissions,
			};
		case 'JOB_LOGOUT':
			return {
				...state,
				govJob: initialState.govJob,
				govJobPermissions: initialState.govJobPermissions,
				attorney: false,
				tabletData: false,
			};
		case 'ADD_DRAFT':
			let id =
				state.drafts.length > 0
					? state.drafts.sort((a, b) => b.draft - a.draft)[0].draft +
					  1
					: 1;

			localStorage.setItem(
				'drafts',
				JSON.stringify([
					...state.drafts,
					{
						...action.payload,
						draft: id,
					},
				]),
			);
			return {
				...state,
				drafts: [
					...state.drafts,
					{
						...action.payload,
						draft: id,
					},
				],
			};
		case 'UPDATE_DRAFT':
			localStorage.setItem(
				'drafts',
				JSON.stringify(
					state.drafts.map((d) => {
						if (d.draft == action.payload.id)
							return action.payload.draft;
						else return d;
					}),
				),
			);
			return {
				...state,
				drafts: state.drafts.map((d) => {
					if (d.draft == action.payload.id)
						return action.payload.draft;
					else return d;
				}),
			};
		case 'REMOVE_DRAFT':
			localStorage.setItem(
				'drafts',
				JSON.stringify(
					state.drafts.filter((d) => d.draft != action.payload.id),
				),
			);
			return {
				...state,
				drafts: state.drafts.filter(
					(d) => d.draft != action.payload.id,
				),
			};
		case 'SET_OPACITY_MODE':
			return {
				...state,
				opacity: action.payload.state,
			}
		case 'APP_SHOW':
			return {
				...state,
				hidden: false,
				opacity: false,
			};
		case 'APP_HIDE':
			return {
				...state,
				hidden: true,
				opacity: false,
			};
		case 'LOGOUT':
			return {
				...initialState,
			};
		default:
			return state;
	}
};

export default appReducer;