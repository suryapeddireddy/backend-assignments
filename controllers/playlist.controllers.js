import Video from '../models/Video.models.js';
import PlayList from "../models/playlist.models.js";


const AddVideotoPlayList=async(req,res)=>{
try {
const {videoId, playListId}=req.params;
const video=await Video.findById(videoId);
if(!video){
return res.status(404).json({message:"video not found"});
}
const playlist=await PlayList.findById(playListId);
if(!playlist){
return res.status(404).json({message:"playlist not found"});
}
playlist.videos.push(videoId);
await playlist.save();
return res.status(200).json({message:"video added to playlist successfully"});
} catch (error) {
return res.status(500).json({message:"error adding video to playlist",error:error.message});
}
}

const RemoveVideofromPlayList=async(req,res)=>{
try {
const {videoId,playListId}=req.params;  
const video=await Video.findById(videoId);
if(!video){
return res.status(404).json({message:"video not found"});
}
const playlist=await PlayList.findById(playListId);
if(!playlist){
return res.status(404).json({message:"playlist not found"});
}
const index=playlist.videos.indexOf(videoId);
if(index==-1){
return res.status(404).json({message:"video not found in playlist"});
}
playlist.videos.splice(index,1);
await playlist.save();
return res.status(200).json({message:"video removed from playlist successfully"});
} catch (error) {
return res.status(500).json({message:"error removing video from playlist",error:error.message}); 
}
}

const CreatePlayList=async(req,res)=>{
try {
 const {name,description}=req.body;
 const userId=req.user?._id;
 const playlist=new PlayList({
 name, description, owner:userId
 });
 await playlist.save(); 
 return res.status(201).jsonw({message:"PlayList created successfully"});  
} catch (error) {
 return res.status(500).json({message:error.message});   
}
}

const UpdatePlayList=async(req,res)=>{
try {
const {name, description}=req.body;
const {playListId}=req.params;
const userId=req.user?._id;
const playlist=await PlayList.findByIdAndUpdate(playListId,{name,description,owner:userId},{new:true});
if(!playlist){
return res.status(404).json({message:"playlist not found"});
}
return res.status(200).json({message:"playlist updated successfully"});
} catch (error) {
 return res.status(500).json({message:"error updating playlist",error:error.message});   
}
}

const DeletePlayList=async(req,res)=>{
try {
const {playListId}=req.params;
const playlist=await PlayList.findByIdAndDelete(playListId);
if(!playlist){
return res.status(404).json({message:"playlist not found"});
} 
return res.status(200).json({message:"playlist deleted successfully"}); 
} catch (error) {
return res.status(500).json({message:"error deleting playlist", error:error.message});
}
}

const GetPlayListById=async(req,res)=>{
try {
 const {name,description}=req.body;
 const userId=req.user?._id;
 const playlist=await PlayList.findOne({name, description,owner:userId});
 if(!playlist){
 return res.status(404).json({message:"Playlist not found"});
 }
 return res.status(200).json({message:"PlayList found"});
} catch (error) {
return res.status(500).json({message:"error getting playlistId", error:error.message});  
}
}

const GetUserPlayLists=async(req,res)=>{
try {
const {userId}=req.params;
const playlists=await PlayList.find({owner:userid});
return res.status(200).json({message:"playlists found",playlists});
} catch (error) {
return res.status(500).json({message:"error getting playlists", error:error.message});
}
}

export {AddVideotoPlayList,RemoveVideofromPlayList,CreatePlayList,UpdatePlayList,DeletePlayList,GetPlayListById,GetUserPlayLists};