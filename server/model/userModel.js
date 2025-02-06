import mongoose from "mongoose";

const { Schema } = mongoose;

export const ROLES = {
  ADMIN: "admin",
  MANAGER: "manager",
  USER: "user",
  SUPERVISOR: "supervisor",
  ACCOUNTANT: "accountant",
  TELESALES: "telesales",
  DISPATCH: "dispatch",
};

const paymentStageSchema = new mongoose.Schema({
  amount: { type: String },
  paymentMode: { type: String },
  date: { type: String },
  status: { type: String },
});

const userSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String },
    password: { type: String },
    primaryContact: { type: String },
    role: { type: String, enum: Object.values(ROLES), default: ROLES.USER },
    managers: [{ type: Schema.Types.ObjectId, ref: "User" }], // Array of manager references

    // for user
    uid: { type: String, unique: true },
    dateAmazon: { type: String },
    dateWebsite: { type: String },
    enrollmentIdAmazon: { type: String },
    enrollmentIdWebsite: { type: String },
    batchAmazon: { type: String },
    batchWebsite: { type: String },
    // website
    callDone: { type: String },
    stage1: paymentStageSchema,
    stage2: paymentStageSchema,
    stage3: paymentStageSchema,
    state: { type: String },
    stateDate: { type: String },
    ovc: { type: String },
    ovcDate: { type: String },
    legality: { type: String },
    legalityDate: { type: String },
    legalityLink: { type: String },
    gst: { type: String },
    gstNumber: { type: String },
    gstDate: { type: String },
    idCard: { type: String },
    idCardDate: { type: String },
    socialMediaContent: { type: String },
    socialMediaContentDate: { type: String },
    theme: { type: String },
    themeStatus: { type: String },
    themeDate: { type: String },
    stage1Completion: { type: String },
    stage1CompletionDate: { type: String },
    catFile: { type: String },
    catFileDate: { type: String },
    logo: { type: String },
    logoStatus: { type: String },
    logoDate: { type: String },
    banner: { type: String },
    bannerDate: { type: String },
    gallery: { type: String },
    galleryDate: { type: String },
    stage2Completion: { type: String },
    stage2CompletionDate: { type: String },
    serverPurchase: { type: String },
    serverPurchaseDate: { type: String },
    serverId: { type: String },
    serverPass: { type: String },
    domainClaim: { type: String },
    domainClaimDate: { type: String },
    domainMailVerification: { type: String },
    domainMailVerificationDate: { type: String },
    websiteUploaded: { type: String },
    websiteUploadedDate: { type: String },
    readyToHandover: { type: String },
    readyToHandoverDate: { type: String },
    stage3Completion: { type: String },
    stage3CompletionDate: { type: String },
    websiteId: { type: String },
    websitePass: { type: String },
    accountOpenIn: { type: String },
    accountOpenInDate: { type: String },
    accountStatusIn: { type: String },
    accountStatusInDate: { type: String },
    brandName: { type: String },
    brandNameDate: { type: String },
    listingsIn: { type: String },
    listingsInDate: { type: String },
    amazonIdIn: { type: String },
    amazonPassIn: { type: String },
    accountLaunchIn: { type: String },
    accountLaunchInDate: { type: String },
    amazonIdCom: { type: String },
    amazonPassCom: { type: String },
    accountOpenCom: { type: String },
    accountOpenComDate: { type: String },
    kycStatus: { type: String },
    kycStatusDate: { type: String },
    listingsCom: { type: String },
    listingsComDate: { type: String },
    accountStatusCom: { type: String },
    accountStatusComDate: { type: String },
    fbaAmountIn: { type: String },
    apobIn: { type: String },
    shippingIn: { type: String },
    fbaLiveIn: { type: String },
    fbaLiveInDate: { type: String },
    dateFbaIn: { type: String },
    gmsIn: { type: String },
    projectedSlabIn: { type: String },
    fbaIn: { type: String },
    projectedPayoutIn: { type: String },
    currentSlabIn: { type: String },
    accountStatusGplIn: { type: String },
    dateFbaCom: { type: String },
    fbaAmountCom: { type: String },
    fbaRegistration: { type: String },
    shipmentCom: { type: String },
    fbaLiveCom: { type: String },

    // for manager
    service: { type: String },
  },
  { timestamps: true }
);

export const User = mongoose.model("User", userSchema);
