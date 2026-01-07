export type Member = {
    id: string
    dateOfBirth: string
    displayName: string
    imageUrl?: string
    created: string
    lastActive: string
    gender: string
    description?: string
    city: string
    country: string
}

export type Photo = {
    id: number
    url: string
    publicId: string
    memberId: string
}
export type EditableMember = {
    // dateOfBirth: string
    displayName: string
    // imageUrl?: string
    // created: string
    // lastActive: string
    // gender: string
    description?: string
    city: string
    country: string
}
