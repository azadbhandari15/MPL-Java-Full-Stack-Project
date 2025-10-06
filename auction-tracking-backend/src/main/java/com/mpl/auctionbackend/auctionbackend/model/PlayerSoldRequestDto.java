package com.mpl.auctionbackend.auctionbackend.model;

import com.mpl.auctionbackend.auctionbackend.entity.model.PlayerAuctionStatus;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PlayerSoldRequestDto {
    private String playerId;
    private String selectedTeam;
    private Integer soldAmount;
    private PlayerAuctionStatus auctionStatus;
}
