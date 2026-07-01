export default function CreateProduct(){
    const [product,setProduct] = useState({
        name : "",
        price : 0,
        category : ""
    })

    const handleChange = (e) => {
        const {name,value} = e.target
        setProduct({
            ...product,
            [name]:value
        })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        const res = await axios.post("http://localhost:5000/api/product/create",product)
        if(res.data.message){
            console.log("Product created successfully")
        }else{
            console.log("Product creation failed")
        }
    }

    return(
        <form onSubmit={handleSubmit}>
            <label htmlFor="name">Nama Product</label>
            <input type="text" placeholder="Nama Product" name="name" onChange={handleChange}/>
            <label htmlFor="price">Harga</label>
            <input type="number" placeholder="Harga" name="price" onChange={handleChange}/>
            <label htmlFor="category">Kategori</label>
            <select name="category" id="category" onChange={handleChange}>
                <option value="" disabled>Pilih Kategori</option>
                <option value="Makanan">Makanan</option>
                <option value="Minuman">Minuman</option>
                <option value="Kebutuhan Pokok">Kebutuhan Pokok</option>
            </select>
            <button type="submit">Tambah Product</button>
        </form>
    )
}