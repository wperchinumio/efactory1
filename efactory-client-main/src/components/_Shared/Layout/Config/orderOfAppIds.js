/*
	this is the config which helps to
	determine what route to show as default
*/

const orderOfAppIds = [
	// not implemented routes excluded

	// overview
		1,2,3,

	// orders
		5,6,7,8,9,10,11,
		12,13,14,15,16,17,18,
		19,20,61,
		21,22,23,
		72,25,

	// items
		26,27,28,29,30,31,32,33,34,
		36,37,38,39,
		40,41,73,

	// order points
		47,48,49,50,51,76,74,53,//Shipping Cost Estimator

	// transportation
		209, 210, 207, 212, 213,

	// EDI Central
		52,
		82,83,84,85,86,87,88,89,90,
		91,92,93,94,95,96,97,98,
		99,100,

	// returntrak
		55,56,54,
		57,58,59,
		75,

	// analytics
		42,43,
		46,63,70,
		44,45,
		64,35,71,211,

	// services
		62,
		67,65,66,99992,
		77,78,79,80,81,
		68,69
]

export default orderOfAppIds
