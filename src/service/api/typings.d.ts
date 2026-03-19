declare namespace API {
  type BaseResponseBoolean_ = {
    code?: number
    data?: boolean
    message?: string
  }

  type BaseResponseListMoneyInfo_ = {
    code?: number
    data?: MoneyInfo[]
    message?: string
  }

  type BaseResponseListOrder_ = {
    code?: number
    data?: Order[]
    message?: string
  }

  type BaseResponseListOrderGroup_ = {
    code?: number
    data?: OrderGroup[]
    message?: string
  }

  type BaseResponseListOrderGroupSelectInfoVO_ = {
    code?: number
    data?: OrderGroupSelectInfoVO[]
    message?: string
  }

  type BaseResponseListRoom_ = {
    code?: number
    data?: Room[]
    message?: string
  }

  type BaseResponseListRoomType_ = {
    code?: number
    data?: RoomType[]
    message?: string
  }

  type BaseResponseListShop_ = {
    code?: number
    data?: Shop[]
    message?: string
  }

  type BaseResponseLoginUserVO_ = {
    code?: number
    data?: LoginUserVO
    message?: string
  }

  type BaseResponseLong_ = {
    code?: number
    data?: number
    message?: string
  }

  type BaseResponsePageMoneyInfo_ = {
    code?: number
    data?: PageMoneyInfo_
    message?: string
  }

  type BaseResponsePageOrder_ = {
    code?: number
    data?: PageOrder_
    message?: string
  }

  type BaseResponsePageRoom_ = {
    code?: number
    data?: PageRoom_
    message?: string
  }

  type BaseResponsePageRoomType_ = {
    code?: number
    data?: PageRoomType_
    message?: string
  }

  type BaseResponsePageShop_ = {
    code?: number
    data?: PageShop_
    message?: string
  }

  type BaseResponsePageUserVO_ = {
    code?: number
    data?: PageUserVO_
    message?: string
  }

  type BaseResponseString_ = {
    code?: number
    data?: string
    message?: string
  }

  type BaseResponseUser_ = {
    code?: number
    data?: User
    message?: string
  }

  type BaseResponseUserVO_ = {
    code?: number
    data?: UserVO
    message?: string
  }

  type checkFingerPrintUsingGETParams = {
    /** fingerPrint */
    fingerPrint?: string
  }

  type checkoutCancelUsingPOSTParams = {
    /** orderId */
    orderId?: number
  }

  type checkoutUsingPOSTParams = {
    /** orderId */
    orderId?: number
  }

  type CreateCronJobRequest = {
    cronExpression?: string
    groupName?: string
    jobClass?: string
    jobName?: string
    params?: Record<string, any>
  }

  type CreateSimpleJobRequest = {
    groupName?: string
    intervalSeconds?: number
    jobClass?: string
    jobName?: string
    repeatCount?: number
  }

  type deleteJobUsingDELETEParams = {
    /** groupName */
    groupName?: string
    /** jobName */
    jobName: string
  }

  type DeleteRequest = {
    id?: number
  }

  type downloadFileUsingGETParams = {
    /** filepath */
    filepath?: string
  }

  type findOrderRemindStateUsingGETParams = {
    /** orderId */
    orderId?: number
  }

  type getJobDetailUsingGETParams = {
    /** groupName */
    groupName?: string
    /** jobName */
    jobName: string
  }

  type getUserByIdUsingGETParams = {
    /** id */
    id?: number
  }

  type getUserVOByIdUsingGETParams = {
    /** id */
    id?: number
  }

  type increaseShopNumUsingGETParams = {
    /** num */
    num?: number
    /** shopId */
    shopId?: number
  }

  type listGroupMoneyInfoByOrderIdUsingPOSTParams = {
    /** orderId */
    orderId?: number
  }

  type listMoneyInfoByOrderIdUsingPOSTParams = {
    /** orderId */
    orderId?: number
  }

  type listOrderGroupDataUsingPOSTParams = {
    /** orderId */
    orderId?: number
  }

  type listOrderGroupSelectInfoUsingPOSTParams = {
    /** orderId */
    orderId?: number
  }

  type LoginUserVO = {
    createTime?: string
    editTime?: string
    id?: number
    updateTime?: string
    userAccount?: string
    userAvatar?: string
    userName?: string
    userProfile?: string
    userRole?: string
  }

  type MoneyInfo = {
    createTime?: string
    id?: number
    isDelete?: number
    money?: number
    moneyType?: string
    operator?: string
    orderId?: number
    payInfo?: string
    payTime?: string
    roomId?: string
    updateTime?: string
  }

  type MoneyInfoFeeRequest = {
    money?: number
    orderId?: number
    payInfo?: string
    payTime?: string
  }

  type MoneyInfoQueryRequest = {
    current?: number
    id?: number
    moneyType?: string
    operator?: string
    orderId?: number
    pageSize?: number
    payInfo?: string
    roomId?: string
    sortField?: string
    sortOrder?: string
  }

  type MoneyInfoUpdateRequest = {
    id?: number
    money?: number
    moneyType?: string
    payInfo?: string
    payTime?: string
  }

  type Order = {
    cardType?: string
    consume?: number
    createTime?: string
    customType?: number
    deductState?: number
    endTime?: string
    id?: number
    idCard?: string
    isDelete?: number
    name?: string
    orderGroupId?: number
    orderInfo?: string
    orderState?: number
    pay?: number
    phone?: string
    restMoney?: number
    roomId?: string
    roomPrice?: number
    roomType?: string
    shopConsume?: number
    startTime?: string
    updateTime?: string
  }

  type OrderChangeRoomPriceRequest = {
    orderId?: number
    payInfo?: string
    roomPrice?: number
  }

  type OrderChangeRoomRequest = {
    orderId?: number
    payInfo?: string
    roomId?: string
    roomPrice?: number
  }

  type OrderCheckInRequest = {
    cardType?: string
    customType?: number
    idCard?: string
    name?: string
    orderInfo?: string
    pay?: number
    phone?: string
    roomList?: RoomCheckInRequest[]
  }

  type OrderContactRequest = {
    orderGroupId?: number
    orderGroupSelectInfoList?: OrderGroupSelectInfoVO[]
  }

  type OrderGroup = {
    createTime?: string
    id?: number
    isDelete?: number
    state?: number
    updateTime?: string
  }

  type OrderGroupSelectInfoVO = {
    id?: number
    orderList?: Order[]
  }

  type OrderQueryRequest = {
    cardType?: string
    consume?: number
    createTime?: string
    current?: number
    customType?: number
    endTime?: string
    id?: number
    idCard?: string
    name?: string
    orderGroupId?: number
    orderInfo?: string
    orderState?: number
    pageSize?: number
    pay?: number
    phone?: string
    restMoney?: number
    roomId?: string
    roomPrice?: number
    roomType?: string
    shopConsume?: number
    sortField?: string
    sortOrder?: string
    startTime?: string
    updateTime?: string
  }

  type OrderUpdateRequest = {
    cardType?: string
    consume?: number
    customType?: number
    id?: number
    idCard?: string
    name?: string
    orderGroupId?: number
    orderInfo?: string
    orderState?: number
    pay?: number
    phone?: string
    restMoney?: number
    roomId?: string
    roomPrice?: number
    roomType?: string
    shopConsume?: number
  }

  type PageMoneyInfo_ = {
    current?: number
    pages?: number
    records?: MoneyInfo[]
    size?: number
    total?: number
  }

  type PageOrder_ = {
    current?: number
    pages?: number
    records?: Order[]
    size?: number
    total?: number
  }

  type PageRoom_ = {
    current?: number
    pages?: number
    records?: Room[]
    size?: number
    total?: number
  }

  type PageRoomType_ = {
    current?: number
    pages?: number
    records?: RoomType[]
    size?: number
    total?: number
  }

  type PageShop_ = {
    current?: number
    pages?: number
    records?: Shop[]
    size?: number
    total?: number
  }

  type PageUserVO_ = {
    current?: number
    pages?: number
    records?: UserVO[]
    size?: number
    total?: number
  }

  type pauseJobUsingPOSTParams = {
    /** groupName */
    groupName?: string
    /** jobName */
    jobName: string
  }

  type resumeJobUsingPOSTParams = {
    /** groupName */
    groupName?: string
    /** jobName */
    jobName: string
  }

  type Room = {
    createTime?: string
    id?: number
    isContact?: boolean
    isDelete?: number
    isTeam?: boolean
    isWindow?: string
    orderId?: number
    roomCustom?: string
    roomFloor?: number
    roomId?: string
    roomInfo?: string
    roomPeopleNum?: number
    roomPrice?: number
    roomState?: number
    roomType?: string
    updateTime?: string
  }

  type RoomAddRequest = {
    isWindow?: string
    roomFloor?: number
    roomId?: string
    roomInfo?: string
    roomPeopleNum?: number
    roomPrice?: number
    roomType?: string
  }

  type RoomCheckInRequest = {
    roomId?: string
    roomPeopleNum?: string
    roomPrice?: number
    roomType?: string
  }

  type RoomQueryRequest = {
    current?: number
    id?: number
    pageSize?: number
    sortField?: string
    sortOrder?: string
  }

  type RoomSetStateRequest = {
    id?: number
    roomState?: number
  }

  type RoomType = {
    createTime?: string
    id?: number
    isDelete?: number
    name?: string
    peopleNum?: number
    price?: number
    updateTime?: string
  }

  type RoomTypeAddRequest = {
    name?: string
    peopleNum?: number
    price?: number
  }

  type RoomTypeQueryRequest = {
    current?: number
    id?: number
    pageSize?: number
    sortField?: string
    sortOrder?: string
  }

  type RoomTypeUpdateRequest = {
    id?: number
    name?: string
    peopleNum?: number
    price?: number
  }

  type RoomUpdateRequest = {
    id?: number
    isWindow?: string
    roomFloor?: number
    roomId?: string
    roomInfo?: string
    roomPeopleNum?: number
    roomPrice?: number
    roomType?: string
  }

  type searchOrderUsingPOSTParams = {
    /** input */
    input?: string
  }

  type setFingerPrintUsingGETParams = {
    /** fingerPrint */
    fingerPrint?: string
  }

  type Shop = {
    createTime?: string
    id?: number
    info?: string
    isDelete?: number
    name?: string
    num?: number
    price?: number
    type?: string
    updateTime?: string
  }

  type ShopAddRequest = {
    info?: string
    name?: string
    num?: number
    price?: number
    type?: string
  }

  type ShopEnterOrderRequest = {
    orderId?: number
    shopList?: Shop[]
  }

  type ShopQueryRequest = {
    current?: number
    id?: number
    info?: string
    name?: string
    num?: number
    pageSize?: number
    price?: number
    sortField?: string
    sortOrder?: string
    type?: string
  }

  type ShopUpdateRequest = {
    id?: number
    info?: string
    name?: string
    num?: number
    price?: number
    type?: string
  }

  type triggerNowUsingPOSTParams = {
    /** groupName */
    groupName?: string
    /** jobName */
    jobName: string
  }

  type User = {
    createTime?: string
    editTime?: string
    id?: number
    isDelete?: number
    updateTime?: string
    userAccount?: string
    userAvatar?: string
    userName?: string
    userPassword?: string
    userProfile?: string
    userRole?: string
  }

  type UserAddRequest = {
    userAccount?: string
    userAvatar?: string
    userName?: string
    userProfile?: string
    userRole?: string
  }

  type UserLoginRequest = {
    userAccount?: string
    userPassword?: string
  }

  type UserQueryRequest = {
    current?: number
    id?: number
    pageSize?: number
    sortField?: string
    sortOrder?: string
    userAccount?: string
    userName?: string
    userProfile?: string
    userRole?: string
  }

  type UserRegisterRequest = {
    checkPassword?: string
    userAccount?: string
    userPassword?: string
  }

  type UserUpdateRequest = {
    id?: number
    userAccount?: string
    userAvatar?: string
    userName?: string
    userProfile?: string
    userRole?: string
  }

  type UserVO = {
    createTime?: string
    id?: number
    updateTime?: string
    userAccount?: string
    userAvatar?: string
    userName?: string
    userProfile?: string
    userRole?: string
  }
}
