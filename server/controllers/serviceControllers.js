import Service from '../models/Service.js'

//GET/services all filtered services
export const getServices= async (req,res)=>{
    const { category } = req.query
    const filter={ isActive: true }

    if(category) filter.category= new RegExp(category, 'i') // i means case insensitive

    const services=await Service.find(filter).sort({createdAt:-1})//-1 ->decreasing

    if(!services){
        return res.status(401).json({message: "Services  not found" })
    }

    res.json(services)
}

//Get particular service by id

export const getService= async (req,res)=>{
    const service= await Service.findOne({_id: req.params.id ,isActive: true})
    if(!service){
        return res.status(404).json({message: "Service not found" })
    }
    res.json(service)
}

// POST request to create an service {ADMIN}

export const createService = async (req, res) => {
    const { name, description, category, basePrice } = req.body
    const image = req.file?.path || ''

    if (!name || !category || !basePrice) {
        return res.status(400).json({ message: 'Name, category and basePrice are required' })
    }

    const service = await Service.create({ name, description, category, basePrice, image })
    res.status(201).json(service)
}

//PATCH req to update the service via id

export const updateService = async (req, res) => {
    const service = await Service.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
    })
    if (!service) return res.status(404).json({ message: 'Service not found' })
    res.json(service)
}


export const deactivateService = async (req, res) => {
    const service = await Service.findByIdAndUpdate(
        req.params.id,
        { isActive: false },
        { new: true }
    )
    if (!service) return res.status(404).json({ message: 'Service not found' })
    res.json({ message: 'Service deactivated successfully' })
}