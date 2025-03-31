const { response } = require("express")
const { ObjectId } = require("mongodb")
const projectsModel = require("../models/projects")

const getProjects = async (req, res) => {
    try {
        const collection = await projectsModel.getPorjects();
        const projects = await collection.find({}).toArray();
        console.log("Projects fetched successfully:", projects)
        res.setHeader("Content-Type", "application/json")
        res.status(200).json(projects)
    } catch (error) {
        console.error("Error fetching projects:", error)
        res.status(500).json({ error: "Internal Server Error" })
    }
}


const getOne = async (req, res) => {
    try {
        const id = req.params.id;

        // Validate the id
        if (!ObjectId.isValid(id)) {
            return res.status(400).json({ error: "Invalid project ID" });
        }

        const collection = await projectsModel.getPorjects();
        const project = await collection.findOne({ _id: new ObjectId(id) });

        if (!project) {
            return res.status(404).json({ error: "Project not found" });
        }

        console.log("Project fetched successfully:", project);
        res.setHeader("Content-Type", "application/json");
        res.status(200).json(project);
    } catch (error) {
        console.error("Error fetching project:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

const projectsForm = async (req, res) => {
    try {
        const defaultData = {
            title: "Website Redesign",
            description: "Revamp the company website to improve user experience and update branding.",
            status: "In Progress",
            start_date: "2025-03-01",
            end_date: "2025-06-01",
            team_members: "Alice, Bob, Charlie",
            image_url: "https://example.com/website-redesign.jpg"
        };
        res.render("new_project", { title: "New Project", project: defaultData });
    } catch (error) {
        console.error("Error rendering project form:", error);
        res.status(500).json({ error: "Error rendering project form" });
    }
};

const editForm = async (req, res) => {
    try {
        const collection = await projectsModel.getPorjects();
        const project = await collection.findOne({ _id: new ObjectId(req.params.id) });

        if (!project) {
            return res.status(404).json({ error: "Project not found" });
        }

        // Ensure dates are converted to Date objects
        project.start_date = new Date(project.start_date);
        project.end_date = new Date(project.end_date);

        console.log("Project fetched successfully:", project);
        res.render("edit_project", { title: "Edit Project", project: project });
    } catch (error) {
        console.error("Error rendering edit form:", error);
        res.status(500).json({ error: "Error rendering edit form" });
    }
};

const addProject = async (req, res) => {
    try {
        const { title, description, status, start_date, end_date, team_members, image_url } = req.body;
        const newProject = {
            title,
            description,
            status,
            start_date: new Date(start_date),
            end_date: new Date(end_date),
            team_members: Array.isArray(team_members) 
                ? team_members.map(member => member.trim()) 
                : team_members.split(",").map(member => member.trim()),
            image_url
        };

        const collection = await projectsModel.getPorjects();
        console.log("Collection:", newProject);
        const result = await collection.insertOne(newProject);

        console.log("Project added successfully:", result);
        res.status(201).json(result);
    } catch (error) {
        console.error("Error adding project:", error);
        res.status(500).json({ error: "error add new project" });
    }
}

const updateProject = async (req, res) => {
    try {
        const id = req.params.id;
        const { title, description, status, start_date, end_date, team_members, image_url } = req.body;
        const updateProject = {
            title,
            description,
            status,
            start_date: new Date(start_date),
            end_date: new Date(end_date),
            team_members: Array.isArray(team_members) 
                ? team_members.map(member => member.trim()) 
                : team_members.split(",").map(member => member.trim()),
            image_url
        };
        const collection = await projectsModel.getPorjects();
        const result = await collection.updateOne(
            { _id: new ObjectId(id) },
            { $set: updateProject }
        );
        if (result.modifiedCount === 0) {
            return res.status(404).json({ error: "Project not found" });
        }
        console.log("Project updated successfully:", result);
        res.status(200).json(result);
    } catch (error) {
        console.error("Error updating project:", error);
        res.status(500).json({ error: "Error updating project" });
    }
}

const deleteProject = async (req, res) => {
    try {
        const id = req.params.id;
        const collection = await projectsModel.getPorjects();
        const result = await collection.deleteOne({ _id: new ObjectId(id) });
        if (result.deletedCount === 0) {
            return res.status(404).json({ error: "Project not found" });
        }
        console.log("Project deleted successfully:", result);
        res.status(200).json(result);
    } catch (error) {
        console.error("Error deleting project:", error);
        res.status(500).json({ error: "Error deleting project" });
    }
}



module.exports = {
    getProjects, getOne, projectsForm, addProject, editForm, updateProject, deleteProject
}
