import { useState } from "react";
import Styles from "./InvoiceLines.module.css";
import SolidBtn from "../../components/ui/SolidBtn/SolidBtn";
import GlowBtn from "../../components/ui/GlowBtn/GlowBtn";

export default function InvoiceLines() {
    // States
    const [invoice, setInvoice] = useState(
        {invoiceNumber: "INV-2024-0892", vendor: "Global logistics Solutions Inc.", invoiceDate: "Oct 24, 2023", dueDate: "Nov 23, 2023"}
    );

    const [lineItems, setLineItems] = useState([
        {id: 1, description: "Standard Shipping Fees (Domestic)", qty: "1.00", unitPrice: "450.00", glAccount: "6100 - Freight & Shipping", tax: "10", amount: "450.00"},
        {id: 2, description: "Pallet Storage - Warehouse B", qty: "5.00", unitPrice: "25.00", glAccount: "6200 - Warehouse Rent", tax: "0", amount: "125.00"},
        {id: 3, description: "Priority Handling Surcharge", qty: "2.00", unitPrice: "75.00", glAccount: "6100 - Freight & Shipping", tax: "10", amount: "150.00"},
    ]);

    // API calls

    // Handler
    function removeItem(id) {
        console.log(id);
        
        const newArr = structuredClone(lineItems);
        const filteredArr = newArr.filter((item)=> item.id !== id);
        setLineItems(filteredArr);
    }

    // JSX
    return(<>
        <div className="main-container p-4 d-flex flex-column gap-4 w-100">
            <div className={`statusCard ${Styles.border} d-flex justify-content-between gap-4 p-4 w-100`}>
                <table className={Styles.invoiceTable}>
                    <thead className="bg-transparent">
                        <tr>
                            <th>INVOICE NUMBER</th>
                            <th>VENDOR</th>
                            <th>INVOICE DATE</th>
                            <th>DUE DATE</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>{invoice.invoiceNumber}</td>
                            <td>{invoice.vendor}</td>
                            <td>{invoice.invoiceDate}</td>
                            <td>{invoice.dueDate}</td>
                        </tr>
                    </tbody>
                </table>

                <div className="btnContainer d-flex gap-3">
                    <SolidBtn text="Edit Header" />
                    <GlowBtn text="Save Progress" />
                </div>
            </div>

            <div className="bodyContainer d-flex gap-4 w-100">

                <div className={`${Styles.lineItems} ${Styles.border} w-75 py-2`}>
                    <div className={`${Styles.bottomBorder} d-flex justify-content-between px-4 py-3 w-100`}>
                        <h5>Line Items</h5>
                        <span className="bg-white p-2 rounded-3 text-black font-monospace">Total Items: {lineItems.length}</span>
                    </div>
                    <table className="w-100">
                        <thead className={`${Styles.header} ${Styles.bottomBorder} bg-transparent`}>
                            <tr>
                               <td>Description</td> 
                               <td>Qty</td> 
                               <td>Unit Price</td> 
                               <td>GL Account</td> 
                               <td>Tax</td> 
                               <td>Amount</td> 
                               <td>Actions</td> 
                            </tr>    
                        </thead>
                        <tbody>
                            {lineItems.map((item)=>(
                                <tr key={item.id} className={Styles.bottomBorder}>
                                    <td>{item.description}</td> 
                                    <td>{item.qty}</td>
                                    <td>${item.unitPrice}</td> 
                                    <td>{item.glAccount}</td>
                                    <td>{item.tax}%</td>
                                    <td>${item.amount}</td>
                                    <td className="d-flex gap-2">
                                        <SolidBtn icon="bi-pencil" />
                                        <SolidBtn icon="bi-trash" action={() => removeItem(item.id)} />
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                        <tfoot>
                            <tr className="text-center">
                                <td colSpan={7} className="py-3">
                                    <SolidBtn text="Add New Row" icon="bi-plus-circle"/>
                                </td>
                            </tr>
                        </tfoot>
                    </table>
                </div>

                <div className={`newLineEntry ${Styles.border} w-25 p-3 d-flex flex-column gap-4`}>
                    <h5>New Line Entry</h5>
                    <form className="newLineForm d-flex flex-column gap-3">
                        <div className="d-flex flex-column gap-2">
                            <label htmlFor="description">DESCRIPTION</label>
                            <textarea id="description" name="description" rows="3" resize="vertical" placeholder="Enter item details..."
                            className={Styles.inputBckg}></textarea>
                        </div>

                        <div className="d-flex gap-2">
                            <div className="d-flex flex-column gap-2 w-50">
                                <label htmlFor="quantity">QUANTITY</label>
                                <input type="number" name="quantity" id="quantity" placeholder="1" min={1}  className={Styles.inputBckg}/>
                            </div>
                            <div className="d-flex flex-column gap-2 w-50">
                                <label htmlFor="unitPrice">UNIT PRICE</label>
                                <input type="number" id="unitPrice" name="unitPrice" placeholder="0.00" min={0} className={Styles.inputBckg}/>
                            </div>
                        </div>

                        <div className="d-flex flex-column gap-2">
                            <label htmlFor="GLAcc">GL ACCOUNT SELECTION</label>
                            <select name="GLAcc" id="GLAcc" className={Styles.inputBckg}>
                                <option value="">Select GL Account</option>
                                <option value="1">1</option>
                                <option value="2">2</option>
                                <option value="3">3</option>
                            </select>
                        </div>

                        <div className="d-flex flex-column gap-2">
                            <label htmlFor="taxRate">TAX RATE SELECTION</label>
                            <select name="taxRate" id="taxRate" className={Styles.inputBckg}>
                                <option value="10" selected>10% - Standard Rate</option>
                                <option value="20">20% - Standard Rate</option>
                                <option value="30">30% - Standard Rate</option>
                                <option value="40">40% - Standard Rate</option>
                                <option value="50">50% - Standard Rate</option>
                                <option value="60">60% - Standard Rate</option>

                            </select>
                        </div>

                        <div className="d-flex flex-column gap-3 mt-4" >
                            <GlowBtn icon="bi-floppy2-fill" text="Save Line Item"  className="w-100" />
                            <SolidBtn icon="bi-x-circle" text="Clear Fields"  className="w-100" />
                        </div>
                    </form>
                </div>

            </div>

        </div>

        
    </>)
}