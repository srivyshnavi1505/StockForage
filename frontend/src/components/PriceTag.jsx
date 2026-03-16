function PriceTag({change}){

return(

<span className={`font-semibold ${
change.includes("+")
? "text-green-500"
: "text-red-500"
}`}>

{change}

</span>

);

}

export default PriceTag;