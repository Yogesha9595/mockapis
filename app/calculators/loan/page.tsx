export default function LoanCalculatorPage() {

return (

<div className="max-w-4xl mx-auto px-6 py-16">

<h1 className="text-3xl font-bold mb-6">
Loan Calculator
</h1>

<p className="text-gray-600 mb-6">
Calculate your monthly loan payment instantly using our free loan calculator.
</p>

<div className="border rounded-lg p-6 bg-white">

<input
type="number"
placeholder="Loan Amount"
className="border p-3 rounded w-full mb-4"
/>

<input
type="number"
placeholder="Interest Rate (%)"
className="border p-3 rounded w-full mb-4"
/>

<input
type="number"
placeholder="Loan Term (years)"
className="border p-3 rounded w-full mb-4"
/>

<button className="bg-green-600 text-white px-6 py-2 rounded">
Calculate
</button>

</div>

</div>

)

}