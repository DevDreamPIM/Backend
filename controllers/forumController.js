import Forum from '../models/Forum.js';
import { validationResult } from "express-validator"; 

export function getAllFeedbacks(req, res) {
    Forum.find({})
      .then((docs) => {
        res.status(200).json(docs);
      })
      .catch((err) => {
        res.status(500).json({ error: err });
      });
  }

  export function addOnce(req, res) {

    console.log(req.body);
    console.log(req.file);
    if (!validationResult(req).isEmpty()) {
        console.log({ errors: validationResult(req).array() })
        return res.status(400).json({ errors: validationResult(req).array() });
    } else {
        Forum.create({
          description: req.body.description,
          
        })
            .then(() => res.status(201).json("OK"))
            .catch((err) => {
                res.status(500).json({ error: err.message });
            });
    }
  
  }


  export async function updateFeedback(req, res) {
    try {
      const descriptionToUpdate = req.params.description; // Extract name from request parameters
  
      let newForumData = req.file
        ? {
           
            description: descriptionToUpdate
            
          }
        : {
            
            description: descriptionToUpdate
            
          };
  
      let updatedFeedback = await Forum.findOneAndUpdate(
        { description: descriptionToUpdate }, 
        newForumData,
        { new: true }
      );
  
      if (updatedFeedback) {
        console.log("Drug updated successfully:", updatedFeedback);
        res.status(200).json(updatedFeedback);
      } else {
        console.log("Drug not found.");
        res.status(404).json({ error: "Drug not found" });
      }
    } catch (err) {
      console.error("Error during drug update:", err);
      res.status(500).json({ error: err.message || "Internal Server Error" });
    }
  }

  export function deleteFeedback(req, res) {
    const { description } = req.params;

    Forum.findOneAndDelete({ "description": description })
        .then(doc => {
            if (doc) {
                console.log("Forum supprimé avec succès :", doc);
                res.status(200).json(doc);
            } else {
                console.log("Forum non trouvé.");
                res.status(404).json({ message: "Forum non trouvé" });
            }
        })
        .catch(err => {
            console.error("Erreur lors de la suppression du forum :", err);
            res.status(500).json({ error: err });
        });
}






